import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { CSSProperties } from 'react'
import { PlaneArt } from './TravelArt'
import { NightCanvas } from './SkyBackground'
import useReducedMotion from './useReducedMotion'

export type FlightDirection = 'forward' | 'back'

type Props = {
  direction: FlightDirection
  // Se llama cuando el cielo ya cubre toda la pantalla: es el momento de cambiar de sección sin que se note el salto.
  onCovered: () => void
  onDone: () => void
}

// Línea de tiempo (segundos): el cielo aparece con un fundido, el tiempo avanza mientras el avión cruza, y el cielo se disuelve en la nueva sección.
const FADE_IN = 0.7
const FLIGHT = 4.6
const FADE_OUT = 1

// El cielo, de arriba a abajo, en cuatro colores (posiciones fijas 0 / 40 / 74 / 100 %).
type Sky = [string, string, string, string]
type Frame = { at: number; sky: Sky }

const NIGHT: Sky = ['#070a24', '#181350', '#3a2a7a', '#6a3f93']       // el mismo cielo de la noche del deseo
const PREDAWN: Sky = ['#141b5c', '#3b3890', '#a04f9a', '#ff9a7a']
const SUNRISE: Sky = ['#3d58b0', '#a07ac8', '#ffa98a', '#ffd699']
const MORNING: Sky = ['#4c92e0', '#8ec2f2', '#dcecf8', '#fff2d8']      // paso intermedio para que el amanecer no se vuelva gris al aclararse
const DAY: Sky = ['#6fbffb', '#a0d8ff', '#d3efff', '#eaf9ff']          // el mismo cielo de la pantalla de Perú
const AFTERNOON: Sky = ['#5aa9ee', '#9fcdf5', '#ffe3b8', '#ffd08a']
const SUNSET: Sky = ['#3a4a9a', '#c25d9a', '#ff8a6a', '#ffc46b']
const DUSK: Sky = ['#151a58', '#3d2c84', '#9a4a9a', '#ff8a7a']

const TO_PERU: Frame[] = [{ at: 0, sky: NIGHT }, { at: 0.3, sky: PREDAWN }, { at: 0.55, sky: SUNRISE }, { at: 0.8, sky: MORNING }, { at: 1, sky: DAY }]
const FROM_PERU: Frame[] = [{ at: 0, sky: DAY }, { at: 0.3, sky: AFTERNOON }, { at: 0.58, sky: SUNSET }, { at: 0.82, sky: DUSK }, { at: 1, sky: NIGHT }]

const CLOUDS = [
  { top: '14%', size: 260, from: 0.0, seconds: 5.4 },
  { top: '58%', size: 340, from: 0.9, seconds: 4.6 },
  { top: '30%', size: 180, from: 1.5, seconds: 4.2 },
  { top: '74%', size: 230, from: 0.3, seconds: 5.0 },
]

const smooth = (from: number, to: number, value: number) => {
  const k = Math.min(1, Math.max(0, (value - from) / (to - from)))
  return k * k * (3 - 2 * k)
}
const bell = (value: number, from: number, peak: number, to: number) => Math.min(smooth(from, peak, value), 1 - smooth(peak, to, value))
const rgb = (color: string) => [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16))
const mix = (a: string, b: string, k: number) => {
  const [r1, g1, b1] = rgb(a)
  const [r2, g2, b2] = rgb(b)
  return `rgb(${Math.round(r1 + (r2 - r1) * k)}, ${Math.round(g1 + (g2 - g1) * k)}, ${Math.round(b1 + (b2 - b1) * k)})`
}

// Colores del cielo en el instante p (0 a 1) de la secuencia: interpola entre fotogramas clave, así el cambio es continuo.
function skyAt(frames: Frame[], p: number): Sky {
  let index = 0
  while (index < frames.length - 2 && p > frames[index + 1].at) index++
  const from = frames[index]
  const to = frames[index + 1]
  const k = smooth(from.at, to.at, p)
  return from.sky.map((color, i) => mix(color, to.sky[i], k)) as Sky
}

// Transición entre secciones: el cielo se funde sobre la página y el tiempo avanza de verdad mientras un avión lo cruza despacio,
// dejando una estela blanca de vapor. Hacia Perú: noche → amanecer → día. De regreso: día → tarde → atardecer → noche.
// Al final el cielo se disuelve en la nueva sección. Con movimiento reducido queda un fundido suave.
function PlaneTransition({ direction, onCovered, onDone }: Props) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const latest = useRef({ onCovered, onDone })

  useEffect(() => { latest.current = { onCovered, onDone } })

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Mientras dura el viaje la página de abajo no se desplaza.
    const block = (event: Event) => event.preventDefault()
    root.addEventListener('wheel', block, { passive: false })
    root.addEventListener('touchmove', block, { passive: false })

    let timeline: gsap.core.Timeline
    if (reduce) {
      timeline = gsap.timeline({ onComplete: () => latest.current.onDone() })
        .fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' })
        .call(() => latest.current.onCovered())
        .to(root, { opacity: 0, duration: 0.35, ease: 'none' }, '+=0.1')
    } else {
      const forward = direction === 'forward'
      const frames = forward ? TO_PERU : FROM_PERU
      const find = <T extends HTMLElement | SVGElement>(selector: string) => root.querySelector<T>(selector)!
      const sky = find<HTMLElement>('.pt-sky')
      const stars = find<HTMLElement>('.pt-stars')
      const moon = find<HTMLElement>('.pt-moon')
      const sun = find<HTMLElement>('.pt-sun')
      const horizon = find<HTMLElement>('.pt-horizon')
      const clouds = find<HTMLElement>('.pt-clouds')
      const banks = find<HTMLElement>('.pt-banks')
      const bankBack = find<HTMLElement>('.sky-bank--back')
      const bankFront = find<HTMLElement>('.sky-bank--front')
      const plane = find<SVGElement>('.pt-plane')
      const contrail = find<HTMLElement>('.pt-contrail')
      const cloudShapes = Array.from(root.querySelectorAll<HTMLElement>('.pt-cloud'))

      const width = root.clientWidth
      const height = root.clientHeight
      const { width: planeWidth, height: planeHeight } = plane.getBoundingClientRect()
      const sunSize = sun.getBoundingClientRect().width
      const planeY = height * 0.36 - planeHeight / 2
      const startX = -planeWidth * 1.1
      const endX = width + planeWidth * 0.2
      // El sol de día queda donde está el de la pantalla de Perú (arriba a la derecha); sale o se pone por el horizonte.
      const dayX = width * 0.92 - sunSize / 2
      const dayY = height * 0.09 + sunSize / 2
      const horizonX = forward ? width * 0.66 : width * 0.24
      const horizonY = height + sunSize * 0.45
      const state = { p: 0, t: 0 }

      const render = () => {
        const { p, t } = state
        // Cielo
        const colors = skyAt(frames, p)
        sky.style.background = `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 40%, ${colors[2]} 74%, ${colors[3]} 100%)`
        const night = forward ? 1 - smooth(0.04, 0.52, p) : smooth(0.55, 0.96, p)
        stars.style.opacity = String(night)
        moon.style.opacity = String(night * 0.95)
        moon.style.translate = `0 ${forward ? smooth(0.1, 0.6, p) * height * 0.32 : (1 - smooth(0.6, 1, p)) * height * 0.32}px`
        // Sol: sube por el horizonte hacia su sitio (ida) o baja hasta ponerse (vuelta); cerca del horizonte es anaranjado.
        const rise = forward ? smooth(0.22, 1, p) : 1 - smooth(0.1, 0.92, p)
        const warm = 1 - smooth(0.35, 0.95, rise)
        sun.style.left = `${horizonX + (dayX - horizonX) * rise}px`
        sun.style.top = `${horizonY + (dayY - horizonY) * rise}px`
        sun.style.setProperty('--sun-core', mix('#fffbe3', '#ffd9a8', warm))
        sun.style.setProperty('--sun-mid', mix('#ffe27a', '#ff9a62', warm))
        sun.style.setProperty('--sun-edge', mix('#ffcf4d', '#ff6a4a', warm))
        sun.style.opacity = String(smooth(0, 0.18, rise))
        // Brillo cálido del horizonte al amanecer / atardecer
        horizon.style.opacity = String(forward ? bell(p, 0.18, 0.5, 0.88) : bell(p, 0.25, 0.58, 0.9))
        horizon.style.setProperty('--horizon', mix('#ff8a6a', '#ffc46b', forward ? smooth(0.3, 0.8, p) : 1 - smooth(0.3, 0.7, p)))
        // Nubes: no hay de noche; se tiñen de rosa al amanecer / atardecer y son blancas de día
        const light = forward ? smooth(0.2, 0.85, p) : 1 - smooth(0.4, 0.9, p)
        clouds.style.setProperty('--cloud-fill', mix('#ffc2a8', '#ffffff', smooth(0.55, 1, light)))
        clouds.style.opacity = String(smooth(0.05, 0.5, light) * 0.95)
        // El banco de nubes de abajo (el mismo de las otras pantallas) sube al clarear y se hunde al anochecer
        banks.style.transform = `translateY(${(1 - smooth(0.1, 0.75, light)) * height * 0.32}px)`
        bankBack.style.setProperty('--bank', mix('#d99fbd', '#ffe9f5', smooth(0.3, 1, light)))
        bankFront.style.setProperty('--bank', mix('#f4c2bb', '#ffffff', smooth(0.3, 1, light)))
        // Avión y estela
        const x = startX + (endX - startX) * t
        const y = planeY + Math.sin(t * Math.PI * 2) * 5
        const bank = Math.sin(t * Math.PI * 2 + 1) * 1.6
        plane.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${bank}deg)`
        const tail = x + planeWidth * 0.04
        const left = Math.max(0, tail - width * 0.62)
        contrail.style.transform = `translate3d(${left}px, ${y + planeHeight * 0.5}px, 0)`
        contrail.style.width = `${Math.max(0, tail - left)}px`
        contrail.style.opacity = String(Math.min(1, t * 6) * (1 - smooth(0.92, 1, t)))
      }
      render()

      timeline = gsap.timeline({ onComplete: () => latest.current.onDone() })
      timeline
        .fromTo(root, { opacity: 0 }, { opacity: 1, duration: FADE_IN, ease: 'power1.inOut' }, 0)
        .to(state, { p: 1, duration: FLIGHT, ease: 'sine.inOut', onUpdate: render }, FADE_IN * 0.5)
        .to(state, { t: 1, duration: FLIGHT, ease: 'none', onUpdate: render }, FADE_IN * 0.5)
      cloudShapes.forEach((cloud, index) => {
        const { from, seconds } = CLOUDS[index]
        const size = cloud.getBoundingClientRect().width
        timeline.fromTo(cloud, { x: forward ? -size - 40 : width + 40 }, { x: forward ? width + 40 : -size - 40, duration: seconds, ease: 'none' }, FADE_IN * 0.5 + from)
      })
      const end = FADE_IN * 0.5 + FLIGHT
      timeline
        .call(() => latest.current.onCovered(), [], end)
        .to(root, { opacity: 0, duration: FADE_OUT, ease: 'power1.inOut' }, end + 0.1)
    }

    return () => {
      timeline.kill()
      root.removeEventListener('wheel', block)
      root.removeEventListener('touchmove', block)
    }
  }, [reduce, direction])

  return (
    <div className={`plane-transition ${reduce ? 'is-reduced' : ''}`} ref={rootRef} data-direction={direction} aria-hidden="true">
      <div className="pt-sky" />
      {!reduce && (
        <>
          <div className="pt-stars"><NightCanvas active plain /></div>
          <div className="sky-moon pt-moon"><i className="sky-moon-disc" /><i className="sky-moon-twinkle sky-moon-twinkle--a" /><i className="sky-moon-twinkle sky-moon-twinkle--b" /></div>
          <div className="pt-horizon" />
          <div className="pt-sun"><i /></div>
          <div className="pt-banks"><div className="sky-bank sky-bank--back" /><div className="sky-bank sky-bank--front" /></div>
          <div className="pt-clouds">
            {CLOUDS.map(cloud => <div key={cloud.top} className="sky-cloud pt-cloud" style={{ top: cloud.top, '--w': `px` } as CSSProperties} />)}
          </div>
          <div className="pt-craft">
            <div className="pt-contrail" />
            <PlaneArt className="pt-plane" />
          </div>
        </>
      )}
    </div>
  )
}

export default PlaneTransition
