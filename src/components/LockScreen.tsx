import { LETTERS, THEMES } from '../content'
import BouncyText from './BouncyText'
import FloatingDecor from './FloatingDecor'
import { MascotPeek } from './Mascot'

type Props = {
  code: string
  digits: number
  onDigit: (digit: string) => void
  onDelete: () => void
}

// '♡' es solo decoración (deshabilitada) para completar la cuadrícula.
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '♡', '0', '⌫']

function LockScreen({ code, digits, onDigit, onDelete }: Props) {
  const full = code.length === digits
  return (
    <>
      <FloatingDecor variant="lock" />
      <section className="pin" aria-label="Contraseña">
        <div className="pin-card">
          <div className="pin-friends" aria-hidden="true">
            {LETTERS.map((letter, index) => (
              <span key={letter.id} className="pin-friend" style={{ animationDelay: `${index * 0.4}s` }}>
                <MascotPeek className="pin-peek" theme={THEMES[letter.id]} />
              </span>
            ))}
          </div>
          <h1 className="pin-title"><BouncyText text="Inserta la contraseña" /></h1>
          <div className="pin-slots pin-slots--row" aria-label={`${code.length} de ${digits} dígitos ingresados`}>
            {Array.from({ length: digits }, (_, index) => (
              <span key={index} className={`pin-slot ${index < code.length ? 'is-filled' : ''}`}>
                <span aria-hidden="true">{index < code.length ? '♥' : '♡'}</span>
              </span>
            ))}
          </div>
          <div className="pin-keys">
            {KEYS.map(key => (
              <button key={key} type="button" className="pin-key"
                disabled={key === '♡' || full}
                aria-label={key === '⌫' ? 'Borrar dígito' : key === '♡' ? 'Decoración' : `Dígito ${key}`}
                onClick={() => key === '⌫' ? onDelete() : onDigit(key)}>
                {key}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default LockScreen
