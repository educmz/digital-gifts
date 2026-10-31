import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { gsap } from 'gsap'
import { THEMES } from '../content'
import type { Letter } from '../content'
import { MascotExtra, MascotFace, MascotPeek, MascotSleeping, MascotTrail } from './Mascot'
import BouncyText from './BouncyText'
import FloatingDecor from './FloatingDecor'
import LetterScene from './LetterScene'
import Sticker from './Sticker'

type Props = {
  letter: Letter
  remaining: number
  flashRef: RefObject<HTMLDivElement | null>
  onBack: () => void
}

// Cada carta revela sus párrafos a su manera: el gatito los desliza con un giro, el pingüino los deja caer
// sobre el hielo con rebote y Totoro los hace brotar.
const REVEAL = {
  cat: { y: 28, rotate: -2.5, scale: 1, duration: 0.95, ease: 'power2.out' },
  penguin: { y: -46, rotate: 0, scale: 1, duration: 1.15, ease: 'bounce.out' },
  totoro: { y: 22, rotate: 0, scale: 0.9, duration: 1, ease: 'back.out(1.8)' },
}
function LetterView({ letter, remaining, flashRef, onBack }: Props) {
  const pageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const theme = THEMES[letter.id]
  const reveal = REVEAL[theme.critter]

  // El amiguito de la barra de lectura avanza con el scroll
  useLayoutEffect(() => {
    const bar = progressRef.current
    if (!bar) return
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.setProperty('--p', String(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [letter.id])

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const paper = page.querySelector<HTMLElement>('.letter-paper')
    const paragraphs = Array.from(page.querySelectorAll<HTMLElement>('.letter-text p'))
    const flash = flashRef.current
    let observer: IntersectionObserver | undefined
    const context = gsap.context(() => {
      gsap.set(paragraphs, { opacity: 0, y: reveal.y, rotate: reveal.rotate, scale: reveal.scale })
      // La carta se despliega con perspectiva, bajo el destello del sobre.
      gsap.from(paper, { opacity: 0, y: 90, scale: 0.8, rotationX: -30, transformPerspective: 1600, duration: 1.3, ease: 'power3.out' })
      // Los párrafos se revelan al leer; se empieza a observar cuando la carta ya casi terminó de desplegarse.
      gsap.delayedCall(0.7, () => {
        const io = new IntersectionObserver(entries => {
          const visible = entries.filter(entry => entry.isIntersecting).map(entry => entry.target as HTMLElement)
          if (!visible.length) return
          visible.forEach(target => io.unobserve(target))
          visible.sort((a, b) => paragraphs.indexOf(a) - paragraphs.indexOf(b))
          context.add(() => { gsap.to(visible, { opacity: 1, y: 0, rotate: 0, scale: 1, duration: reveal.duration, ease: reveal.ease, stagger: 0.14 }) })
        }, { rootMargin: '0px 0px -8% 0px' })
        observer = io
        paragraphs.forEach(paragraph => io.observe(paragraph))
      })
    }, page)
    const flashFade = flash ? gsap.to(flash, { opacity: 0, duration: 1.1, delay: 0.1, ease: 'power2.out' }) : undefined
    return () => {
      observer?.disconnect()
      flashFade?.kill()
      context.revert()
    }
  }, [flashRef, letter.id, reveal])

  const themeStyle = {
    '--paper': theme.paper, '--edge': theme.edge, '--accent': theme.accent, '--ink': theme.ink,
    '--bg1': theme.bg1, '--bg2': theme.bg2,
  } as CSSProperties

  return (
    <div className={`letter-page letter-page--${theme.critter}`} ref={pageRef} style={themeStyle}>
      <LetterScene theme={theme} />
      <div className="read-progress" ref={progressRef} aria-hidden="true">
        <i className="read-fill" />
        <span className="read-rider"><MascotFace theme={theme} /></span>
      </div>
      <FloatingDecor variant="letter" symbols={[
        <MascotTrail key="trail" theme={theme} />,
        <MascotFace key="face" theme={theme} />,
        '♥',
        <MascotExtra key="extra" theme={theme} />,
        <MascotTrail key="trail2" theme={theme} />,
        '✦',
      ]} />
      <button type="button" className="back-pill" onClick={onBack}>← Volver a los sobres</button>

      <article className="letter-paper" aria-label={`Carta de ${letter.name}`}>
        <MascotPeek className="mascot-peek" theme={theme} />
        {letter.stickers.map((slot, index) => (
          <Sticker key={slot.src} slot={slot} index={index} theme={theme} />
        ))}
        <div className="paw-trail" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => <MascotTrail key={index} theme={theme} />)}
        </div>
        <h1 className="letter-title"><BouncyText text={letter.title} pop={false} /></h1>
        <p className="letter-subtitle">{letter.subtitle}</p>
        <div className="letter-text">
          {letter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        <div className="letter-end">
          <MascotSleeping className="mascot-sleeping" theme={theme} />
          <p className="letter-signature">— {letter.signature}</p>
          <div className="paw-trail" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => <MascotTrail key={index} theme={theme} />)}
          </div>
          <button type="button" className="letter-back" onClick={onBack}>Volver a los sobres ✉</button>
          {remaining > 0 && <small>Te {remaining === 1 ? 'falta 1 carta' : `faltan ${remaining} cartas`} por abrir</small>}
        </div>
      </article>
    </div>
  )
}

export default LetterView
