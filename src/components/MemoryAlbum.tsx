import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, SyntheticEvent } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MEMORIES } from '../content'
import BouncyText from './BouncyText'
import FloatingDecor from './FloatingDecor'
import useMediaQuery from './useMediaQuery'
import useReducedMotion from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const image = (path: string) => import.meta.env.BASE_URL + 'images/' + path
const hideImage = (event: SyntheticEvent<HTMLImageElement>) => { event.currentTarget.closest('li')?.setAttribute('hidden', '') }

const TILTS = [-3.2, 2.4, -1.6, 3.1, -2.4, 1.8, -3, 2.2, -1.4, 2.8, -2]
const TAPES = ['#ffe27acc', '#bfe3ffcc', '#ffc2d9cc', '#d2f3d9cc']
// Foquitos de colores colgados de lado a lado de la pared. El cable es un SVG que se estira al ancho de la pantalla y los foquitos
// son elementos aparte (así no se deforman) colocados en porcentaje sobre la curva del cable.
const BULB_COUNT = 27
const BULBS = Array.from({ length: BULB_COUNT }, (_, i) => {
  const fraction = 0.015 + (i / (BULB_COUNT - 1)) * 0.97
  const u = ((fraction * 1000) % 500) / 500
  return { left: `${(fraction * 100).toFixed(2)}%`, top: `${(((8 + 92 * u * (1 - u)) / 70) * 100).toFixed(1)}%`, color: ['#ffd36b', '#ff8fb8', '#8fd8ff', '#b79cf2', '#7fe0b0'][i % 5], delay: -((i * 0.53) % 3) }
})

function Lights() {
  return (
    <div className="album-lights" aria-hidden="true">
      <svg viewBox="0 0 1000 70" preserveAspectRatio="none" focusable="false">
        <path d="M0 8 Q250 54 500 8 Q750 54 1000 8" fill="none" stroke="#a0528099" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </svg>
      {BULBS.map((bulb, index) => (
        <i key={index} className="album-bulb" style={{ left: bulb.left, top: bulb.top, color: bulb.color, animationDelay: `${bulb.delay}s` }} />
      ))}
    </div>
  )
}
// Inclina la polaroid hacia donde está el puntero (efecto 3D suave)
function tiltCard(event: ReactPointerEvent<HTMLButtonElement>) {
  if (event.pointerType !== 'mouse') return
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  button.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`)
  button.style.setProperty('--rx', `${(-y * 14).toFixed(2)}deg`)
}
function resetTilt(event: ReactPointerEvent<HTMLButtonElement>) {
  event.currentTarget.style.setProperty('--ry', '0deg')
  event.currentTarget.style.setProperty('--rx', '0deg')
}

// El visor se dibuja en el body (createPortal): así queda siempre por encima de la despedida y no depende de los apilamientos de la página.
// Álbum de recuerdos: fotos pegadas como polaroids sobre una pared con foquitos; cada una lleva un muñequito pegado arriba.
// Las columnas flotan y se desfasan al hacer scroll, las fotos entran rebotando y se inclinan hacia el puntero; al tocar una se abre grande.
function MemoryAlbum() {
  const reduce = useReducedMotion()
  const columns = useMediaQuery('(max-width: 860px)') ? 2 : 3
  const rootRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduce) return
    const context = gsap.context(() => {
      gsap.from('.album-head > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out', clearProps: 'opacity,transform' })
      root.querySelectorAll<HTMLElement>('.polaroid').forEach((card, index) => {
        const sticker = card.querySelector('.polaroid-sticker')
        const timeline = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 94%' } })
        timeline.from(card, { opacity: 0, y: 70, rotate: index % 2 ? 9 : -9, scale: 0.88, duration: 0.85, ease: 'back.out(1.4)', clearProps: 'opacity,transform' })
        if (sticker) timeline.from(sticker, { scale: 0, rotate: -40, duration: 0.6, ease: 'back.out(2.4)', clearProps: 'scale,transform' }, 0.45)
        timeline.add(() => card.classList.add('is-in'), 0.5)
      })
      // Las columnas se desfasan con el scroll, como capas de una pared
      const wall = root.querySelector('.album-wall')
      root.querySelectorAll<HTMLElement>('.album-col').forEach((column, index) => {
        gsap.to(column, { y: index % 2 ? -46 : 38, ease: 'none', scrollTrigger: { trigger: wall, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
      })
      gsap.to('.album-chibi', { y: 60, ease: 'none', scrollTrigger: { trigger: '.album-head', start: 'top top', end: 'bottom top', scrub: 0.5 } })
    }, root)
    // Cada foto que termina de cargar puede cambiar las alturas: se recalculan las posiciones del scroll
    let pending = 0
    const refresh = () => { window.clearTimeout(pending); pending = window.setTimeout(() => ScrollTrigger.refresh(), 120) }
    root.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', refresh, { once: true }) })
    refresh()
    void document.fonts.ready.then(refresh)
    return () => { window.clearTimeout(pending); context.revert() }
  }, [reduce, columns])

  const close = useCallback(() => {
    setOpen(null)
    setDirection(null)
    openerRef.current?.focus({ preventScroll: true })
  }, [])
  const step = useCallback((delta: number) => {
    setDirection(delta > 0 ? 'next' : 'prev')
    setOpen(current => current === null ? null : (current + delta + MEMORIES.length) % MEMORIES.length)
  }, [])

  // Teclado mientras el visor está abierto
  useEffect(() => {
    if (open === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowRight') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, step])

  const current = open === null ? null : MEMORIES[open]

  return (
    <section className="album" ref={rootRef} aria-labelledby="album-title">
      <FloatingDecor variant="section" />
      <Lights />

      <header className="album-head">
        <div className="album-chibi-wrap">
          <img className="album-chibi" src={image('personaje/chibicumple-sm.png')} alt="" onError={event => { event.currentTarget.style.display = 'none' }} />
          <i className="album-orbit album-orbit--a" aria-hidden="true">✦</i>
          <i className="album-orbit album-orbit--b" aria-hidden="true">♥</i>
          <i className="album-orbit album-orbit--c" aria-hidden="true">✧</i>
        </div>
        <p className="album-kicker">Un álbum para Hetto</p>
        <h1 className="album-title" id="album-title"><BouncyText text="Nuestros recuerdos" pop={false} /></h1>
        <p className="album-sub">Toca una foto para verla grande</p>
      </header>

      <div className="album-wall">
        {Array.from({ length: columns }, (_, column) => (
          <ul className="album-col" key={column}>
            {MEMORIES.map((memory, index) => index % columns === column && (
              <li className="polaroid" key={memory.src} style={{ '--tilt': `${TILTS[index % TILTS.length]}deg`, '--tape': TAPES[index % TAPES.length], '--bob': `${-(index * 0.9) % 4}s` } as CSSProperties}>
                <button type="button" className="polaroid-button" aria-label={`Ver grande: ${memory.caption}`}
                  onPointerMove={tiltCard} onPointerLeave={resetTilt}
                  onClick={event => { openerRef.current = event.currentTarget; setDirection(null); setOpen(index) }}>
                  <span className="polaroid-tape" aria-hidden="true" />
                  <span className="polaroid-photo">
                    <img src={image(memory.src)} alt={memory.alt} width={memory.size[0]} height={memory.size[1]} decoding="async" onError={hideImage} />
                    <span className="polaroid-shine" aria-hidden="true" />
                  </span>
                  <span className="polaroid-caption">{memory.caption}</span>
                </button>
                {memory.sticker && (
                  <img className={`polaroid-sticker polaroid-sticker--${memory.corner ?? 'tr'}`} src={image(memory.sticker)} alt="" onError={event => { event.currentTarget.style.display = 'none' }} />
                )}
                <i className="polaroid-spark polaroid-spark--a" aria-hidden="true">✦</i>
                <i className="polaroid-spark polaroid-spark--b" aria-hidden="true">✧</i>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {current && createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.caption} onClick={close}>
          <figure className={`lightbox-card ${direction ? `lightbox-card--${direction}` : ''}`} key={open} onClick={event => event.stopPropagation()}>
            <img src={image(current.src)} alt={current.alt} />
            <figcaption>{current.caption}</figcaption>
            {current.sticker && <img className="lightbox-sticker" src={image(current.sticker)} alt="" />}
          </figure>
          <button type="button" className="lightbox-close" onClick={close} aria-label="Cerrar" autoFocus>✕</button>
          <button type="button" className="lightbox-nav lightbox-nav--prev" onClick={event => { event.stopPropagation(); step(-1) }} aria-label="Foto anterior">‹</button>
          <button type="button" className="lightbox-nav lightbox-nav--next" onClick={event => { event.stopPropagation(); step(1) }} aria-label="Foto siguiente">›</button>
        </div>,
        document.body,
      )}
    </section>
  )
}

export default MemoryAlbum
