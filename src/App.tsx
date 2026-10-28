import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Personalización: cambia el código y la pista aquí.
// Nota: es una sorpresa visual, NO un sistema de autenticación seguro.
const PASSCODE = '2410'
const HINT = 'Pista: el día que finalmente me dijiste que sí.'
const DIGITS = 4

type Result = 'success' | 'error' | null

function App() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<Result>(null)
  const [birthdayStage, setBirthdayStage] = useState<'locked' | 'countdown' | 'ready' | 'character' | 'envelope' | 'letter' | 'gallery'>('locked')
  const [seconds, setSeconds] = useState(3)
  const [openingEnvelope, setOpeningEnvelope] = useState(false)
  const revealTrackRef = useRef<HTMLDivElement>(null)
  const letterRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const envelopeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!code || result !== null) return
    if (!PASSCODE.startsWith(code)) {
      setResult('error')
    } else if (code.length === DIGITS) {
      setResult('success')
    }
  }, [code, result])

  useEffect(() => {
    if (birthdayStage !== 'countdown') return
    if (seconds === 0) {
      setBirthdayStage('ready')
      return
    }
    const timer = window.setTimeout(() => setSeconds(value => value - 1), 1100)
    return () => window.clearTimeout(timer)
  }, [birthdayStage, seconds])

  useEffect(() => {
    if (birthdayStage !== 'character') return
    const timer = window.setTimeout(() => setBirthdayStage('envelope'), 3800)
    return () => window.clearTimeout(timer)
  }, [birthdayStage])

  useEffect(() => {
    if (birthdayStage !== 'letter') return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [birthdayStage])

  useLayoutEffect(() => {
    if (birthdayStage !== 'letter') return
    const track = revealTrackRef.current
    const letter = letterRef.current
    const gallery = galleryRef.current
    if (!track || !letter || !gallery) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      gsap.fromTo(letter, { opacity: 0, y: 80, scale: 0.8, rotation: -6 }, {
        opacity: 1, y: 0, scale: 1, rotation: -1,
        duration: reduceMotion ? 0 : 1.2, ease: 'power3.out'
      })
      if (reduceMotion) {
        gsap.set(gallery, { opacity: 1, y: 0, scale: 1 })
        return
      }
      gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top bottom',
          end: 'top top',
          scrub: 0.65,
          invalidateOnRefresh: true
        }
      })
        .fromTo(letter,
          { y: 0, scale: 1, rotation: -1, rotationX: 0, opacity: 1, filter: 'blur(0px)' },
          { y: () => -window.innerHeight * 0.76, scale: 0.48, rotation: 11, rotationX: -18, opacity: 0, filter: 'blur(7px)', ease: 'power2.in' }, 0)
        .fromTo(gallery,
          { opacity: 0.08, yPercent: 7, scale: 0.94 },
          { opacity: 1, yPercent: 0, scale: 1, ease: 'power1.out' }, 0.12)

    })
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    return () => { window.clearTimeout(refresh); context.revert() }
  }, [birthdayStage])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (result !== null) return
      if (/^[0-9]$/.test(event.key)) {
        setCode(current => current.length < DIGITS ? current + event.key : current)
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        setCode(current => current.slice(0, -1))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [result])

  const typeDigit = (digit: string) => {
    if (result || code.length >= DIGITS) return
    setCode(previous => previous + digit)
  }
  const deleteDigit = () => {
    if (!result) setCode(previous => previous.slice(0, -1))
  }
  const beginBirthday = () => {
    setSeconds(3)
    setBirthdayStage('countdown')
  }
  const openEnvelope = () => {
    if (openingEnvelope) return
    const envelope = envelopeRef.current
    if (!envelope) return
    setOpeningEnvelope(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBirthdayStage('letter')
      setOpeningEnvelope(false)
      return
    }
    gsap.timeline({
      onComplete: () => {
        setBirthdayStage('letter')
        setOpeningEnvelope(false)
      }
    })
      .to(envelope.querySelector('.envelope-heart'), { opacity: 0, duration: 0.15 }, 0)
      .to(envelope.querySelector('.envelope-instruction'), { opacity: 0, duration: 0.15 }, 0)
      .to(envelope.querySelector('.envelope-flap'), { rotateX: 175, transformOrigin: '50% 0%', duration: 0.5, ease: 'power2.inOut' }, 0)
      .to(envelope.querySelector('.envelope-paper'), { y: -70, rotate: -3, duration: 0.65, ease: 'power3.out' }, 0.15)
      .to(envelope, { scale: 1.7, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 0.55)
  }
  const tryAgain = () => {
    setCode('')
    setResult(null)
  }

  return (
    <main className={birthdayStage === 'locked' ? 'gift-screen' : 'birthday-screen'}>
      {birthdayStage === 'locked' && (
        <section className="lock" aria-label="Ingresa tu código secreto">
          <h1>Ingresa el código</h1>
          <div className="heart-slots" aria-label={`${code.length} de 4 dígitos ingresados`}>
            {Array.from({ length: DIGITS }, (_, index) => (
              <span key={index} className={`heart-slot ${index < code.length ? 'active' : ''}`}>
                <span aria-hidden="true">♥</span>
              </span>
            ))}
          </div>
          <p className="hint">{HINT}</p>
          <div className="calculator">
            <div className="keys">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'].map(key => (
                <button key={key} type="button"
                  disabled={key === '.' || code.length === DIGITS}
                  aria-label={key === 'DEL' ? 'Borrar dígito' : key === '.' ? 'Decoración' : `Dígito ${key}`}
                  onClick={() => key === 'DEL' ? deleteDigit() : typeDigit(key)}>
                  {key}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {birthdayStage !== 'locked' && (
        <section className="birthday-content" aria-live="polite">
          {birthdayStage === 'countdown' && (
            <>
              <h1 className="birthday-top">¡Pide un deseo!<span>El cumpleaños de Hetto está por comenzar</span></h1>
              <span className="count-number" key={seconds}>{seconds}</span>
              <div className="cake-art">
                <div className="cake-fallback" aria-label="Torta de cumpleaños"><i className="candle" /><i className="cake-upper" /><i className="cake-lower" /></div>
                <img src={import.meta.env.BASE_URL + 'images/birthday-cake.gif'} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
            </>
          )}
          {birthdayStage === 'ready' && (
            <>
              <h1 className="birthday-top">¡Pide un deseo!<span>¡Pide un deseo, Hetto!</span></h1>
              <div className="cake-art">
                <div className="cake-fallback" aria-label="Birthday cake"><i className="candle" /><i className="cake-upper" /><i className="cake-lower" /></div>
                <img src={import.meta.env.BASE_URL + 'images/birthday-cake.gif'} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
              <button className="birthday-action" onClick={() => setBirthdayStage('character')}>Continuar ♡</button>
            </>
          )}
          {birthdayStage === 'envelope' && (
            <div className="envelope-scene">
              <h1 className="envelope-heading">Tengo algo para ti, Hetto ♡</h1>
              <p>Hay unas palabras que quiero regalarte...</p>
              <button className="envelope-button" ref={envelopeRef} onClick={openEnvelope} aria-label="Abrir la carta" disabled={openingEnvelope}>
                <span className="envelope-paper" />
                <span className="envelope-flap" />
                <span className="envelope-heart">♥</span>
                <span className="envelope-instruction">Toca para abrir</span>
              </button>
            </div>
          )}
          {birthdayStage === 'letter' && (
            <article className="birthday-letter immersive-letter" ref={letterRef}>
              <div className="letter-sparkle">♡ ✦ ♡</div>
              <h1>Para Hetto, con cariño</h1>
              <p className="letter-date">Una carta especialmente para ti</p>
              <div className="letter-body">
                <p>Querida Hetto:</p>
                <p>Hoy quería regalarte algo distinto. No algo que se abra una sola vez y después se guarde en un cajón, sino unas palabras a las que puedas volver cuando quieras. Una pequeña carta para recordarte lo mucho que mereces sentirte querida, acompañada y feliz.</p>
                <p>Me gusta pensar que hay personas capaces de volver especiales los momentos más simples. A veces no hace falta un gran plan ni una ocasión extraordinaria: basta con una conversación que se alarga sin darnos cuenta, una risa inesperada o esa tranquilidad de poder ser uno mismo.</p>
                <p>Contigo he aprendido a apreciar todavía más esos pequeños instantes. Los que parecen cotidianos mientras suceden, pero después se convierten en recuerdos a los que uno vuelve con una sonrisa. Ojalá nunca olvidemos lo valioso que puede ser un día cualquiera.</p>
                <p>Hay tantas cosas que me gustaría desearte en tu cumpleaños que seguramente ninguna carta alcanzaría. Quiero que tengas días ligeros, de esos en los que todo parece acomodarse. Que encuentres motivos para reír incluso cuando la semana se ponga difícil y que nunca falten sueños que te hagan ilusión.</p>
                <p>También te deseo paciencia contigo misma. Que puedas celebrar cada paso que das, incluso los pequeños, incluso esos que nadie más ve. Que no te exijas tener todas las respuestas ahora y que te permitas descubrir cosas nuevas sin miedo a equivocarte.</p>
                <p>Espero que este nuevo año te regale aventuras, lugares que todavía no conoces, canciones que se vuelvan favoritas y momentos tan bonitos que desees detener el tiempo un ratito. Y también días tranquilos, porque la felicidad a veces llega sin hacer ruido.</p>
                <p>Gracias por tu manera de ser, por los detalles que quizá para ti pasan desapercibidos y por la alegría que compartes. Gracias por las conversaciones, por las risas y por esos instantes que se quedan guardados aunque no les hayamos tomado una fotografía.</p>
                <p>Si algún día todo se siente demasiado pesado, espero que al leer esto recuerdes que no tienes que convertir cada día en algo perfecto. Está bien descansar, empezar de nuevo y avanzar a tu propio ritmo. Lo importante es que no pierdas esa parte de ti que hace que el mundo se sienta un poquito más cálido.</p>
                <p>Me hace ilusión pensar en todos los recuerdos que todavía faltan. En las fotos que aún no hemos tomado, en los lugares que nos harán reír, en las historias que contaremos una y otra vez y en las pequeñas tradiciones que quizá aparezcan sin planearlas.</p>
                <p>Quiero que recuerdes que las cosas bonitas no siempre llegan como las imaginamos. A veces se esconden en un mensaje a mitad del día, en una mirada cómplice o en una tarde que empezó sin planes y terminó siendo inolvidable. Ojalá podamos seguir reconociéndolas.</p>
                <p>Y cuando mires hacia atrás, espero que veas mucho más que fechas y acontecimientos. Que veas cuánto has crecido, cuánto has aprendido, cuántas veces seguiste adelante y cuántas personas han tenido la suerte de coincidir contigo.</p>
                <p>Si pudiera guardar un deseo especial dentro de esta carta, sería que nunca dudes del cariño que mereces. Que te rodeen personas que escuchen tus historias, celebren tus logros, te acompañen en los días grises y quieran verte brillar sin pedirte que seas diferente.</p>
                <p>Me gustaría que cada cumpleaños fuera también una oportunidad para agradecer lo vivido. Incluso lo imperfecto, porque muchas veces de allí nacen las lecciones más importantes, las anécdotas más divertidas y las versiones de nosotros mismos que aprendemos a querer.</p>
                <p>Quizá cuando vuelvas a abrir esta página hayan pasado semanas, meses o mucho más tiempo. Tal vez algunas cosas sean distintas. Pero espero que estas palabras sigan recordándote lo mismo: hoy, y cada vez que las leas, deseo de corazón que estés bien.</p>
                <p>Gracias por estar aquí, por ser tú y por hacer que tantos momentos merezcan recordarse. Que la vida te sorprenda de las formas más bonitas y que nunca falte una razón para seguir soñando.</p>
                <p>Feliz cumpleaños, Hetto. Que este sea un capítulo lleno de luz, cariño, aventuras y recuerdos inolvidables. Y que cuando termine, tengas muchísimas historias nuevas que contar.</p>
                <p>Con muchísimo cariño, para ti. ♡</p>
              </div>
              <div className="letter-end" id="letter-end-trigger">
                <span>♥</span>
                <strong>Fin de la carta. ¡Feliz cumpleaños! ♡</strong>
                <small>Desliza hacia abajo para ver nuestros recuerdos ↓</small>
              </div>
            </article>
          )}
          {birthdayStage === 'letter' && (
            <div className="memories-reveal-track" ref={revealTrackRef}>
            <section className="memory-gallery cinematic-gallery" ref={galleryRef} aria-label="Galería de recuerdos de Hetto">
              <h1 className="gallery-heading">Gracias por llenar tantos momentos de alegría ♡</h1>
              <div className="memories-grid">
                <p className="memory-caption memory-caption-left">Atesoro cada momento compartido contigo. Las risas, las conversaciones y hasta los días más sencillos se vuelven recuerdos bonitos.</p>
                {Array.from({ length: 6 }, (_, index) => (
                  <div className={`memory-frame frame-${index + 1}`} key={index}>
                    <img
                      src={import.meta.env.BASE_URL + `images/memories/recuerdo-${index + 1}.jpeg`}
                      alt={`Recuerdo ${index + 1} de Hetto`}
                      onError={event => { event.currentTarget.style.display = 'none' }}
                    />
                    <span className="memory-placeholder">♡<small>Foto {index + 1}</small></span>
                  </div>
                ))}
                <p className="memory-caption memory-caption-middle">Otro año, otra razón para agradecer que estés aquí. ♡</p>
                <p className="memory-caption memory-caption-right">Por todas las sonrisas que ya compartimos y por las historias nuevas que todavía nos esperan.</p>
              </div>
              <p className="gallery-footer">Que cada día te regale motivos para sonreír. ¡Por muchos recuerdos más, Hetto! ♥</p>
            </section>
            </div>
          )}
          {birthdayStage === 'character' && (
            <>
              <h1 className="birthday-headline">¡Feliz cumpleaños, Hetto!</h1>
              <p className="birthday-subtitle">Tengo una cartita para ti...</p>
              <div className="birthday-character">
                <span className="birthday-character-fallback">♡<small>Tu carta está por llegar</small></span>
                <img src={import.meta.env.BASE_URL + 'images/character-letter.gif'} alt="Personaje entregando una carta" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
            </>
          )}
        </section>
      )}

      {result && birthdayStage === 'locked' && (
        <div className="modal-overlay">
          <section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <h2 id="result-title">{result === 'success' ? '¡Acceso permitido!' : '¡Código incorrecto!'}</h2>
            <div className={`character ${result}`} role="img" aria-label={result === 'success' ? 'Perrito feliz' : 'Perrito triste'}>
              <img className="character-image" src={import.meta.env.BASE_URL + 'images/' + (result === 'success' ? 'success-character.webp' : 'error-character.webp')} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
            </div>
            <p>{result === 'success' ? '¡Lo conseguiste!' : '¿Intentamos otra vez?'}</p>
            <button className="modal-button" onClick={result === 'error' ? tryAgain : beginBirthday}>
              {result === 'success' ? 'Continuar' : 'Reintentar'}
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
