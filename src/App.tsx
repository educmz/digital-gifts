import { useEffect, useState } from 'react'
import './App.css'

// Personalización: cambia el código y la pista aquí.
// Nota: es una sorpresa visual, NO un sistema de autenticación seguro.
const PASSCODE = '2410'
const HINT = 'Hint: The day you finally said “YES” to me.'
const DIGITS = 4

type Result = 'success' | 'error' | null

function App() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<Result>(null)
  const [birthdayStage, setBirthdayStage] = useState<'locked' | 'countdown' | 'ready' | 'character'>('locked')
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
        <section className="lock" aria-label="Enter your secret code">
          <h1>Enter Code</h1>
          <div className="heart-slots" aria-label={`${code.length} of 4 digits entered`}>
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
                  aria-label={key === 'DEL' ? 'Delete digit' : key === '.' ? 'Decoration' : `Digit ${key}`}
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
              <h1 className="birthday-top">ขอพรสิ...<span>Make a wish...</span></h1>
              <span className="count-number" key={seconds}>{seconds}</span>
              <div className="cake-art">
                <div className="cake-fallback" aria-label="Birthday cake"><i className="candle" /><i className="cake-upper" /><i className="cake-lower" /></div>
                <img src={import.meta.env.BASE_URL + 'images/birthday-cake.webp'} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
            </>
          )}
          {birthdayStage === 'ready' && (
            <>
              <h1 className="birthday-top">ขอพรสิ...<span>¡Pide un deseo, Hetto!</span></h1>
              <div className="cake-art">
                <div className="cake-fallback" aria-label="Birthday cake"><i className="candle" /><i className="cake-upper" /><i className="cake-lower" /></div>
                <img src={import.meta.env.BASE_URL + 'images/birthday-cake.webp'} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
              <button className="birthday-action" onClick={() => setBirthdayStage('character')}>Continuar ♡</button>
            </>
          )}
          {birthdayStage === 'character' && (
            <>
              <h1 className="birthday-headline">¡Feliz cumpleaños, Hetto!</h1>
              <p className="birthday-subtitle">Tengo una cartita para ti...</p>
              <div className="birthday-character">
                <span className="birthday-character-fallback">♡<small>Tu carta está por llegar</small></span>
                <img src={import.meta.env.BASE_URL + 'images/character-letter.webp'} alt="Personaje entregando una carta" onError={e => { e.currentTarget.style.display = 'none' }} />
              </div>
            </>
          )}
        </section>
      )}

      {result && birthdayStage === 'locked' && (
        <div className="modal-overlay">
          <section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <h2 id="result-title">{result === 'success' ? 'Access Granted!' : 'Wrong Passcode!'}</h2>
            <div className={`character ${result}`} role="img" aria-label={result === 'success' ? 'Happy puppy' : 'Sad puppy'}>
              <img className="character-image" src={import.meta.env.BASE_URL + 'images/' + (result === 'success' ? 'success-character.webp' : 'error-character.webp')} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
            </div>
            <p>{result === 'success' ? 'Congrats you passed!' : 'Try Again?'}</p>
            <button className="modal-button" onClick={result === 'error' ? tryAgain : beginBirthday}>
              {result === 'success' ? 'Proceed' : 'Retry'}
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
