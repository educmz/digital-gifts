import { useEffect, useState } from 'react'
import './App.css'

// Personalización: cambia el código y la pista aquí.
// Nota: es una sorpresa visual, NO un sistema de autenticación seguro.
const PASSCODE = '0720'
const HINT = 'Hint: The day you finally said “YES” to me.'
const DIGITS = 4

type Result = 'success' | 'error' | null

function App() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<Result>(null)

  useEffect(() => {
    if (code.length !== DIGITS || result !== null) return
    const timer = window.setTimeout(() => {
      setResult(code === PASSCODE ? 'success' : 'error')
    }, 250)
    return () => window.clearTimeout(timer)
  }, [code, result])

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
  const tryAgain = () => {
    setCode('')
    setResult(null)
  }

  return (
    <main className="gift-screen">
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
              <button
                key={key}
                type="button"
                disabled={key === '.' || code.length === DIGITS}
                aria-label={key === 'DEL' ? 'Delete digit' : key === '.' ? 'Decoration' : `Digit ${key}`}
                onClick={() => key === 'DEL' ? deleteDigit() : typeDigit(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </section>

      {result && (
        <div className="modal-overlay">
          <section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <h2 id="result-title">{result === 'success' ? 'Access Granted!' : 'Wrong Passcode!'}</h2>
            <div className={`character ${result}`} role="img" aria-label={result === 'success' ? 'Happy puppy' : 'Sad puppy'}>
              <span className="character-fallback" aria-hidden="true">{result === 'success' ? '🐶💗' : '🥺💧'}</span>
            </div>
            <p>{result === 'success' ? 'Congrats you passed!' : 'Try Again?'}</p>
            <button className="modal-button" onClick={result === 'error' ? tryAgain : () => window.alert('The next gift page is coming soon! 💗')}>
              {result === 'success' ? 'Proceed' : 'Retry'}
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
