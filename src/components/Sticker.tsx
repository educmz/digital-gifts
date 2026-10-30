import { useState } from 'react'
import type { CSSProperties } from 'react'
import { MascotFace } from './Mascot'
import type { StickerSlot, Theme } from '../content'

type Props = {
  slot: StickerSlot
  index: number
  theme: Theme
}

const px = (value: number | string | undefined) =>
  typeof value === 'number' ? `calc(${value}px * var(--k))` : value

// Sticker pegado sobre la carta. Si el archivo todavía no existe, muestra la mascota de relleno.
function Sticker({ slot, index, theme }: Props) {
  const [missing, setMissing] = useState(false)
  const style = {
    top: px(slot.top), left: px(slot.left), right: px(slot.right), bottom: px(slot.bottom),
    '--size': slot.size, '--rot': `${slot.rotate}deg`, '--d': `${1 + index * 0.18}s`,
  } as CSSProperties
  return (
    <div className={`sticker ${slot.desktopOnly ? 'sticker--desk' : ''}`} style={style}>
      {missing ? (
        <span className="sticker-fallback">
          <MascotFace theme={theme} />
        </span>
      ) : (
        <img src={import.meta.env.BASE_URL + 'images/' + slot.src} alt="" onError={() => setMissing(true)} />
      )}
    </div>
  )
}

export default Sticker
