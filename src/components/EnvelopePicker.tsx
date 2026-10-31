import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { gsap } from 'gsap'
import { LETTERS, THEMES } from '../content'
import BouncyText from './BouncyText'
import { MascotPeek } from './Mascot'

type Props = {
  opened: number[]
  flashRef: RefObject<HTMLDivElement | null>
  onOpen: (index: number) => void
  onContinue: () => void
}

function EnvelopePicker({ opened, flashRef, onOpen, onContinue }: Props) {
  const [opening, setOpening] = useState<number | null>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const listRef = useRef<HTMLUListElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Reacción al acercarte: cada sobre mide qué tan cerca está el puntero (--near, de 0 a 1) y hacia qué lado (--dx).
  // El CSS usa esos valores para levantarlo, inclinarlo, entreabrir la solapa y asomar la carta y el animalito.
  useEffect(() => {
    const list = listRef.current
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(list.children) as HTMLElement[]
    let pointer: { x: number; y: number } | null = null
    let frame = 0
    const apply = () => {
      frame = 0
      for (const item of items) {
        const envelope = item.querySelector<HTMLElement>('.mini-envelope')
        if (!pointer || !envelope) { item.style.removeProperty('--near'); item.style.removeProperty('--dx'); continue }
        const rect = envelope.getBoundingClientRect()
        const dx = pointer.x - (rect.left + rect.width / 2)
        const dy = pointer.y - (rect.top + rect.height / 2)
        const near = Math.pow(Math.max(0, 1 - Math.hypot(dx, dy) / (rect.width * 1.25)), 1.4)
        item.style.setProperty('--near', near.toFixed(3))
        item.style.setProperty('--dx', Math.max(-1, Math.min(1, dx / (rect.width * 0.6))).toFixed(3))
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(apply) }
    const move = (event: PointerEvent) => { pointer = { x: event.clientX, y: event.clientY }; schedule() }
    const leave = () => { pointer = null; schedule() }
    const release = (event: PointerEvent) => { if (event.pointerType !== 'mouse') leave() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', leave)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', leave)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  // Esta pantalla no se desplaza: si todo el contenido no cabe en la ventana, se reduce lo justo para que quepa.
  useLayoutEffect(() => {
    const picker = pickerRef.current
    if (!picker) return
    const fit = () => {
      const natural = picker.offsetHeight   // la altura real, sin contar la reducción
      picker.style.setProperty('--fit', String(natural > 0 ? Math.max(0.5, Math.min(1, window.innerHeight / natural)) : 1))
    }
    fit()
    window.addEventListener('resize', fit)
    void document.fonts.ready.then(fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  const allOpened = opened.length === LETTERS.length

  const open = (index: number) => {
    if (opening !== null) return
    const button = buttons.current[index]
    if (!button) return
    setOpening(index)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onOpen(index)
      return
    }
    const timeline = gsap.timeline({ onComplete: () => onOpen(index) })
      .to(button.querySelector('.mini-seal'), { opacity: 0, duration: 0.15 }, 0)
      .to(button.querySelector('.mini-flap'), { rotateX: 175, transformOrigin: '50% 0%', duration: 0.5, ease: 'power2.inOut' }, 0)
      .to(button.querySelector('.mini-paper'), { y: -46, duration: 0.6, ease: 'power3.out' }, 0.15)
      .to(button, { scale: 1.9, duration: 0.6, ease: 'power2.in' }, 0.5)
    // El destello rosado cubre el cambio de sobre a carta y se desvanece al abrirse la carta.
    if (flashRef.current) timeline.to(flashRef.current, { opacity: 0.95, duration: 0.4, ease: 'power2.in' }, 0.65)
  }

  return (
    <div className="picker" ref={pickerRef}>
      <h1 className="envelope-heading"><BouncyText text="Tres cartas para ti, Hetto ♡" /></h1>
      <p className="picker-sub">Elige un sobre para empezar a leer...</p>
      <ul className="picker-list" ref={listRef}>
        {LETTERS.map((letter, index) => {
          const theme = THEMES[letter.id]
          const read = opened.includes(index)
          const style = { '--paper': theme.paper, '--edge': theme.edge, '--accent': theme.accent, '--ear': theme.ear, '--delay': `${index * 0.45}s` } as CSSProperties
          return (
            <li key={letter.id} style={style} className={opening === index ? 'is-opening' : ''}>
              <button type="button" className="mini-envelope" ref={element => { buttons.current[index] = element }}
                onClick={() => open(index)} disabled={opening !== null} aria-label={`Abrir la carta de ${letter.name}`}>
                <MascotPeek className="mini-peek" theme={theme} />
                <span className="mini-paper" />
                <span className="mini-body" />
                <span className="mini-flap" />
                <span className="mini-seal">♥</span>
              </button>
              <span className="mini-name">De {letter.name}</span>
              <span className={`mini-badge ${read ? 'is-read' : ''}`}>{read ? '✓ Leída' : 'Sin abrir'}</span>
            </li>
          )
        })}
      </ul>
      {allOpened ? (
        <button type="button" className="birthday-action" onClick={onContinue}>Ver los recuerdos ♡</button>
      ) : (
        <p className="picker-hint">Abre las tres cartas para seguir ({opened.length}/{LETTERS.length})</p>
      )}
    </div>
  )
}

export default EnvelopePicker
