import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './App.css'
import './extras.css'
import './letters.css'
import './scenes.css'
import './lock.css'
import './sky.css'
import './skyfx.css'
import './intro.css'
import './cake.css'
import './room.css'
import './peru.css'
import './peruPage.css'
import './album.css'
import './music.css'
import { LETTERS } from './content'
import { installHeartEffects } from './heartEffects'
import { music } from './music'
import BouncyText from './components/BouncyText'
import CakeScene from './components/CakeScene'
import EnvelopePicker from './components/EnvelopePicker'
import FloatingDecor from './components/FloatingDecor'
import IntroPrank from './components/IntroPrank'
import LetterView from './components/LetterView'
import LockScreen from './components/LockScreen'
import Memories from './components/Memories'
import PeruSection from './components/PeruSection'
import PlaneTransition from './components/PlaneTransition'
import type { FlightDirection } from './components/PlaneTransition'
import MusicPlayer from './components/MusicPlayer'
import SkyBackground from './components/SkyBackground'

// Personalización: el código es la fecha del cumpleaños (día y mes, por ejemplo 2410). Cámbialo aquí.
// Nota: es una sorpresa visual, NO un sistema de autenticación seguro.
const PASSCODE = '2410'
const DIGITS = 4

type Result = 'success' | 'error' | null
type Stage = 'intro' | 'locked' | 'cake' | 'envelope' | 'letter' | 'memories' | 'peru'
type Flight = { to: Stage; direction: FlightDirection }

// Con "?skip" en la dirección se salta la broma del inicio (útil para probar).
const skipIntro = () => new URLSearchParams(window.location.search).has('skip')

function App() {
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<Stage>(() => skipIntro() ? 'locked' : 'intro')
  const [activeLetter, setActiveLetter] = useState(0)
  const [openedLetters, setOpenedLetters] = useState<number[]>([])
  const [night, setNight] = useState(false)
  const [dark, setDark] = useState(false)
  // La broma se desvanece encima de la pantalla de la fecha (fundido cruzado) antes de quitarse.
  const [introLeaving, setIntroLeaving] = useState(false)
  // Viaje en avión entre la sección principal y la de Perú (null = sin viaje en curso).
  const [flight, setFlight] = useState<Flight | null>(null)
  const returnToEnd = useRef(false)
  const covering = useRef(false)
  const [modalClosing, setModalClosing] = useState(false)   // el aviso de acceso se desvanece antes de pasar a la torta
  const flashRef = useRef<HTMLDivElement>(null)
  const sunriseTimer = useRef(0)

  useEffect(() => installHeartEffects(), [])

  // La música empieza con el primer toque (los navegadores no dejan que suene sola); en la broma de inicio todavía no suena.
  useEffect(() => {
    if (stage === 'intro') return
    const go = () => music.start()
    window.addEventListener('pointerdown', go, { once: true })
    window.addEventListener('keydown', go, { once: true })
    return () => { window.removeEventListener('pointerdown', go); window.removeEventListener('keydown', go) }
  }, [stage])

  const result: Result = !code ? null
    : !PASSCODE.startsWith(code) ? 'error'
    : code.length === DIGITS ? 'success'
    : null

  useEffect(() => () => window.clearTimeout(sunriseTimer.current), [])

  useEffect(() => {
    if (!introLeaving) return
    const done = window.setTimeout(() => setIntroLeaving(false), 900)
    return () => window.clearTimeout(done)
  }, [introLeaving])

  useEffect(() => {
    if (stage !== 'envelope' && stage !== 'letter' && stage !== 'memories' && stage !== 'peru') return
    window.scrollTo({ top: 0, behavior: 'instant' })
    // Al volver de Perú se regresa a la despedida, donde estaba el botón del avión.
    if (stage === 'memories' && returnToEnd.current) {
      returnToEnd.current = false
      const toEnd = () => {
        const buttons = document.querySelector('.closing-actions')
        if (buttons) window.scrollTo({ top: buttons.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.6, behavior: 'instant' })
      }
      toEnd()
      const later = window.setTimeout(toEnd, 300)
      return () => window.clearTimeout(later)
    }
  }, [stage])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (stage !== 'locked' || result !== null) return
      if (/^[0-9]$/.test(event.key)) {
        setCode(current => current.length < DIGITS ? current + event.key : current)
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        setCode(current => current.slice(0, -1))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [result, stage])

  const typeDigit = (digit: string) => {
    if (result || code.length >= DIGITS) return
    setCode(previous => previous + digit)
  }
  const deleteDigit = () => {
    if (!result) setCode(previous => previous.slice(0, -1))
  }
  const openLetter = (index: number) => {
    setActiveLetter(index)
    setOpenedLetters(current => current.includes(index) ? current : [...current, index])
    setStage('letter')
  }
  const tryAgain = () => setCode('')
  // Cambio de pantalla con un destello rosado que la cubre y se retira (sin cortes bruscos entre cartas, sobres y recuerdos).
  const coverTo = (to: Stage) => {
    const flash = flashRef.current
    if (!flash || covering.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage(to); return }
    covering.current = true
    gsap.to(flash, {
      opacity: 1, duration: 0.3, ease: 'power1.in', overwrite: true,
      onComplete: () => {
        setStage(to)
        gsap.to(flash, { opacity: 0, duration: 0.7, delay: 0.15, ease: 'power1.out', overwrite: true, onComplete: () => { covering.current = false } })
      },
    })
  }
  const enterCake = () => {
    if (modalClosing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDark(true); setStage('cake'); return }
    setModalClosing(true)
    window.setTimeout(() => { setDark(true); setStage('cake'); setModalClosing(false) }, 340)
  }
  const fly = (to: Stage, direction: FlightDirection) => {
    if (flight) return
    returnToEnd.current = to === 'memories'
    setFlight({ to, direction })
  }
  // Primero amanece (el cielo vuelve al día) y recién entonces entran los sobres, sin pantallas intermedias.
  const finishWish = () => {
    if (sunriseTimer.current) return
    setNight(false)
    sunriseTimer.current = window.setTimeout(() => {
      sunriseTimer.current = 0
      setStage('envelope')
    }, 1800)
  }

  const showSky = stage === 'locked' || stage === 'cake' || stage === 'envelope'
  const showBunting = stage === 'cake' || stage === 'envelope'
  const showDecor = showBunting

  return (
    <main className={`${stage === 'locked' || stage === 'intro' ? 'gift-screen' : stage === 'peru' ? 'peru-screen' : stage === 'memories' ? 'memories-screen' : 'birthday-screen'} ${night ? 'is-night' : ''} ${dark ? 'is-dark' : ''} ${modalClosing ? 'is-leaving' : ''}`}>
      <div className="letter-flash" ref={flashRef} aria-hidden="true" />
      <MusicPlayer visible={stage !== 'intro'} />
      {showSky && <SkyBackground night={night} />}
      {showDecor && <FloatingDecor />}
      {showBunting && (
        <div className="bunting" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => <i key={index} />)}
        </div>
      )}

      {(stage === 'intro' || introLeaving) && (
        <IntroPrank leaving={introLeaving} onDone={() => { music.start(); setIntroLeaving(true); setStage('locked') }} />
      )}

      {stage === 'locked' && (
        <LockScreen code={code} digits={DIGITS} onDigit={typeDigit} onDelete={deleteDigit} />
      )}

      {stage === 'peru' && <PeruSection onBack={() => fly('memories', 'back')} />}

      {stage !== 'locked' && stage !== 'intro' && stage !== 'peru' && (
        <section className="birthday-content">
          {stage === 'cake' && <CakeScene onNight={setNight} onDark={setDark} onDone={finishWish} />}
          {stage === 'envelope' && (
            <div className="stage">
              <EnvelopePicker opened={openedLetters} flashRef={flashRef} onOpen={openLetter} onContinue={() => coverTo('memories')} />
            </div>
          )}
          {stage === 'letter' && (
            <LetterView key={LETTERS[activeLetter].id} letter={LETTERS[activeLetter]}
              remaining={LETTERS.length - openedLetters.length} flashRef={flashRef} onBack={() => coverTo('envelope')} />
          )}
          {stage === 'memories' && <Memories onBack={() => coverTo('envelope')} onTravel={() => fly('peru', 'forward')} />}
        </section>
      )}

      {flight && <PlaneTransition direction={flight.direction} onCovered={() => setStage(flight.to)} onDone={() => setFlight(null)} />}

      {result && stage === 'locked' && (
        <div className={`modal-overlay ${modalClosing ? 'is-closing' : ''}`}>
          <section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <h2 id="result-title"><BouncyText text={result === 'success' ? '¡Acceso permitido!' : '¡Código incorrecto!'} /></h2>
            <div className={`character ${result}`} role="img" aria-label={result === 'success' ? 'Perrito feliz' : 'Perrito triste'}>
              <img className="character-image" src={import.meta.env.BASE_URL + 'images/' + (result === 'success' ? 'success-character.webp' : 'error-character.webp')} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
            </div>
            <p>{result === 'success' ? '¡Lo conseguiste!' : '¿Intentamos otra vez?'}</p>
            <button className="modal-button" onClick={result === 'error' ? tryAgain : enterCake}>
              {result === 'success' ? 'Continuar' : 'Reintentar'}
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
