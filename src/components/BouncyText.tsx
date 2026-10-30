import { Fragment } from 'react'
import type { CSSProperties } from 'react'

type Props = {
  text: string
  // Con pop, las letras entran rebotando; sin pop solo hacen la ola.
  pop?: boolean
}

// Texto cuyas letras rebotan en cadena. Usa <b>/<i> (y no <span>) para no chocar con
// selectores existentes como ".birthday-top span". Las palabras no se parten al saltar de línea.
function BouncyText({ text, pop = true }: Props) {
  const words = text.split(' ')
  const starts = words.reduce<number[]>((acc, _word, index) => {
    acc.push(index === 0 ? 0 : acc[index - 1] + Array.from(words[index - 1]).length)
    return acc
  }, [])
  return (
    <b className={`bouncy ${pop ? 'bouncy--pop' : ''}`}>
      <em className="sr-only">{text}</em>
      <i className="bouncy-visual" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            {wordIndex > 0 && ' '}
            <i className="bouncy-word">
              {Array.from(word).map((char, charIndex) => (
                <i key={charIndex} className="bouncy-char" style={{ '--i': starts[wordIndex] + charIndex } as CSSProperties}>{char}</i>
              ))}
            </i>
          </Fragment>
        ))}
      </i>
    </b>
  )
}

export default BouncyText
