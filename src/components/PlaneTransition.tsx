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

// Nubes del vuelo: pocas, pequeñas y cada una en su propio carril (así nunca se encimen) y lejos de la línea del avión.
const CLOUDS = [
  { top: '8%', size: 190, from: 0.0, seconds: 5.4 },
  { top: '52%', size: 200, from: 0.8, seconds: 4.8 },
  { top: '78%', size: 150, from: 0.3, seconds: 5.2 },
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
      const plane = find<SVGElement>('.pt-plane')
      const contrail = find<SVGElement>('.pt-contrail')
      const trailGradient = find<SVGElement>('#ptTrailGradient')
      const trailPaths = Array.from(root.querySelectorAll<SVGPathElement>('.pt-contrail path'))
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

      // Posición del avión en cada instante t (0 a 1): avanza en línea recta, sube y baja suave y se balancea un poco.
      const pose = (t: number) => ({
        x: startX + (endX - startX) * t,
        y: planeY + Math.sin(t * Math.PI * 2) * 5,
        bank: Math.sin(t * Math.PI * 2 + 1) * 1.6,
      })
      // Punta de la cola del avión (de donde sale la estela), ya girada con el balanceo
      const tailAt = (t: number): [number, number] => {
        const { x, y, bank } = pose(t)
        const dx = -planeWidth * 0.48
        const dy = planeHeight * (0.38 - 0.5)
        const rad = (bank * Math.PI) / 180
        return [x + planeWidth / 2 + dx * Math.cos(rad) - dy * Math.sin(rad), y + planeHeight / 2 + dx * Math.sin(rad) + dy * Math.cos(rad)]
      }
      // La estela es una cinta que sigue el camino real que dejó el avión (curva con él) y se adelgaza y desvanece hacia atrás.
      const TRAIL_POINTS = 30
      const drawTrail = (t: number) => {
        const [tailX] = tailAt(t)
        const leftX = Math.max(0, tailX - width * 0.58)
        const span = tailX - leftX
        if (span < 6) { trailPaths.forEach(path => path.setAttribute('d', '')); return }
        const top: string[] = []
        const bottom: string[] = []
        for (let i = 0; i <= TRAIL_POINTS; i++) {
          const u = i / TRAIL_POINTS                       // 0 = extremo lejano, 1 = junto al avión
          const sampleX = leftX + span * u
          const sampleT = Math.max(0, t - (tailX - sampleX) / (endX - startX))
          const [, sampleY] = tailAt(sampleT)
          const half = (0.5 + 2.6 * u * u) / 2 * 2         // grosor: casi un hilo atrás, ~5 px junto al avión
          top.push(`${sampleX.toFixed(1)} ${(sampleY - half).toFixed(1)}`)
          bottom.push(`${sampleX.toFixed(1)} ${(sampleY + half).toFixed(1)}`)
        }
        const d = `M${top.join(' L')} L${bottom.reverse().join(' L')} Z`
        trailPaths.forEach(path => path.setAttribute('d', d))
        trailGradient.setAttribute('x1', String(leftX))
        trailGradient.setAttribute('x2', String(tailX))
      }

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
        // Avión y estela
        const { x, y, bank } = pose(t)
        plane.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${bank}deg)`
        drawTrail(t)
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
          <div className="pt-clouds">
            {CLOUDS.map(cloud => <div key={cloud.top} className="sky-cloud pt-cloud" style={{ top: cloud.top, '--w': `${cloud.size}px` } as CSSProperties} />)}
          </div>
          <div className="pt-craft">
            <svg className="pt-contrail" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="ptTrailGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset=".65" stopColor="#fff" stopOpacity=".7" />
                  <stop offset="1" stopColor="#fff" stopOpacity=".95" />
                </linearGradient>
              </defs>
              <path className="pt-trail-glow" fill="url(#ptTrailGradient)" />
              <path className="pt-trail-line" fill="url(#ptTrailGradient)" />
            </svg>
            <PlaneArt className="pt-plane" />
          </div>
        </>
      )}
    </div>
  )
}

export default PlaneTransition
