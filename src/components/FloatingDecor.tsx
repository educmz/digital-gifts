import type { CSSProperties, ReactNode } from 'react'

const SYMBOLS: ReactNode[] = ['♥', '✦', '♡', '✧', '❀']

// Posiciones pseudoaleatorias pero fijas, para que el render sea puro y estable.
const ITEMS = Array.from({ length: 18 }, (_, index) => {
  const random = (salt: number) => {
    const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
    return value - Math.floor(value)
  }
  return {
    pink: index % 3 !== 0,
    style: {
      left: `${random(1) * 100}%`,
      fontSize: `${14 + random(2) * 22}px`,
      animationDuration: `${14 + random(3) * 14}s`,
      animationDelay: `${-random(4) * 28}s`,
      '--drift': `${(random(5) - 0.5) * 120}px`,
      '--alpha': 0.35 + random(6) * 0.4,
    } as CSSProperties,
  }
})

type Props = {
  variant?: 'screen' | 'section' | 'letter' | 'lock'
  // Adornos que suben flotando; por defecto corazones y destellos.
  symbols?: ReactNode[]
}

function FloatingDecor({ variant = 'screen', symbols = SYMBOLS }: Props) {
  return (
    <div className={`floating-decor floating-decor--${variant}`} aria-hidden="true">
      {ITEMS.map((item, index) => (
        <span key={index} className={`decor-item ${item.pink ? 'is-pink' : ''}`} style={item.style}>
          {symbols[index % symbols.length]}
        </span>
      ))}
    </div>
  )
}

export default FloatingDecor
