import { useEffect, useState } from 'react'
import './App.css'

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
    setShowLetterEnd(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
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
              <button className="envelope-button" onClick={() => setBirthdayStage('letter')} aria-label="Abrir la carta">
                <span className="envelope-paper" />
                <span className="envelope-flap" />
                <span className="envelope-heart">♥</span>
                <span className="envelope-instruction">Toca para abrir</span>
              </button>
            </div>
          )}
          {birthdayStage === 'letter' && (
            <article className="birthday-letter">
              <div className="letter-sparkle">♡ ✦ ♡</div>
              <h1>Para Hetto, con cariño</h1>
              <p className="letter-date">Una carta especialmente para ti</p>
              <div className="letter-body">
                <p>Querida Hetto:</p>
                <p>Hoy es un día especial y quería regalarte algo que pudieras guardar y volver a leer cuando quisieras.</p>
                <p>Espero que este nuevo año de vida venga lleno de momentos felices, pequeñas sorpresas y muchos motivos para sonreír.</p>
                <p>Que nunca te falten las personas que te quieren, los sueños que te ilusionan y las ganas de disfrutar cada momento.</p>
                <p>Gracias por ser tú, por compartir tu alegría y por hacer especiales los días más sencillos.</p>
                <p>Ojalá que este cumpleaños sea solo el comienzo de muchísimas cosas bonitas que te esperan.</p>
                <p>Con mucho cariño, feliz cumpleaños, Hetto. ♡</p>
              </div>
              <div className="letter-end" id="letter-end-trigger">
                <span>♥</span>
                <strong>Fin de la carta. ¡Feliz cumpleaños! ♡</strong>
                <small>Desliza hacia abajo para ver nuestros recuerdos ↓</small>
              </div>
            </article>
          )}
          {birthdayStage === 'letter' && (
            <section className="memory-gallery" aria-label="Galería de recuerdos de Hetto">
              <h1 className="gallery-heading">Gracias por llenar tantos momentos de alegría ♡</h1>
              <div className="memories-grid">
                <p className="memory-caption memory-caption-left">Cada recuerdo contigo es especial. Sigamos creando muchos más.</p>
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
                <p className="memory-caption memory-caption-right">Por todas las risas, las aventuras y las historias que aún nos esperan.</p>
              </div>
              <p className="gallery-footer">¡Por muchos recuerdos más, Hetto! ♥</p>
            </section>
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
