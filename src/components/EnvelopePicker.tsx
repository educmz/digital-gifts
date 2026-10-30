import { useRef, useState } from 'react'
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
    <div className="picker">
      <h1 className="envelope-heading"><BouncyText text="Tres cartas para ti, Hetto ♡" /></h1>
      <p className="picker-sub">Elige un sobre para empezar a leer...</p>
      <ul className="picker-list">
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
