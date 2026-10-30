import type { CSSProperties } from 'react'
import { LETTERS, THEMES } from '../content'
import { MascotFace } from './Mascot'

// Luces de hadas: una guirnalda ondulada con focos de colores pastel (posiciones fijas).
const BULB_COLORS = ['#ff9fc4', '#cdb8ff', '#a9ecd0', '#ffe08a', '#ffffff']
const BULBS = Array.from({ length: 16 }, (_, index) => {
  const x = ((index + 0.5) * 100) / 16
  const y = 3.4 + 1.8 * Math.sin(index * 0.9)
  return { x, y, color: BULB_COLORS[index % BULB_COLORS.length] }
})
const WIRE = `M0 3.4 ${BULBS.map(bulb => `L${bulb.x.toFixed(2)} ${bulb.y.toFixed(2)}`).join(' ')} L100 3.4`

// Estrellas de la ventana
const WINDOW_STARS: [number, number, number][] = [
  [30, 40, 1.4], [52, 30, 1], [70, 20, 1.6], [40, 70, 1], [90, 76, 1.3], [24, 96, 1.1], [62, 92, 1], [98, 40, 1],
]

const INK = '#3a2a3f'

// Un globo: cuerpo ovalado con brillo, nudo abajo y un hilo que llega hasta el punto de amarre (tx, ty).
function Balloon({ color, x, y, tx, ty }: { color: string; x: number; y: number; tx: number; ty: number }) {
  const knotY = y + 29
  return (
    <g>
      <path d={`M${x} ${knotY + 3} Q${(x + tx) / 2 + (x < tx ? 6 : -6)} ${(knotY + ty) / 2} ${tx} ${ty}`} fill="none" stroke="#fff" strokeWidth="1.3" opacity=".9" />
      <path d={`M${x} ${y - 28} C${x + 22} ${y - 28} ${x + 25} ${y + 4} ${x + 11} ${y + 21} C${x + 6} ${y + 27} ${x + 2} ${y + 29} ${x} ${y + 29} C${x - 2} ${y + 29} ${x - 6} ${y + 27} ${x - 11} ${y + 21} C${x - 25} ${y + 4} ${x - 22} ${y - 28} ${x} ${y - 28} Z`}
        fill={color} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={`M${x - 3} ${knotY - 1} h6 l-3 6 z`} fill={color} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx={x - 9} cy={y - 14} rx="4" ry="9" fill="#fff" opacity=".55" transform={`rotate(18 ${x - 9} ${y - 14})`} />
    </g>
  )
}

// Ramo de globos atado a una cajita de regalo con moño.
function BalloonBunch({ className, colors }: { className?: string; colors: string[] }) {
  const tx = 60
  const ty = 196
  const spots: [number, number][] = [[60, 34], [30, 70], [90, 68], [44, 112], [78, 110]]
  return (
    <svg className={className} viewBox="0 0 120 236" aria-hidden="true">
      {spots.map(([x, y], index) => <Balloon key={index} color={colors[index % colors.length]} x={x} y={y} tx={tx} ty={ty} />)}
      <rect x="40" y="203" width="40" height="28" rx="4" fill="#ffc2da" stroke={INK} strokeWidth="1.8" />
      <path d="M60 203 V231 M40 217 H80" stroke="#fff" strokeWidth="4" />
      <path d="M60 203 C50 190 44 200 60 203 C76 200 70 190 60 203 Z" fill="#ff7fb8" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

const RIGHT_BUNCH = ['#3a2f45', '#ff8fc4', '#ffffff', '#b79cf2', '#ffc4de']
const LEFT_BUNCH = ['#ff8fc4', '#b79cf2', '#ffffff', '#3a2f45', '#ffc4de']

type Props = {
  // Luces de la sala encendidas
  lit: boolean
  // Se esconde cuando se pasa a la noche con estrellas
  hidden?: boolean
}

const asset = (name: string) => import.meta.env.BASE_URL + 'images/room/' + name
const character = (name: string) => import.meta.env.BASE_URL + 'images/personaje/' + name

// Una casa de fiesta: pared con papel tapiz, ventana de noche, luces de hadas, cuadros con ustedes,
// Kuromi y My Melody, globos y alfombra. Con las luces apagadas la oscuridad la pone CakeScene.
function RoomBackground({ lit, hidden = false }: Props) {
  return (
    <div className={`room ${lit ? 'is-lit' : 'is-dim'} ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <div className="room-wall" />
      <div className="room-floor"><div className="room-rug" /></div>

      <svg className="room-window" viewBox="0 0 120 170">
        <defs>
          <linearGradient id="roomNightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14104a" />
            <stop offset="1" stopColor="#5a3a8f" />
          </linearGradient>
          <clipPath id="roomWindowClip"><path d="M14 156 V62 A46 46 0 0 1 106 62 V156 Z" /></clipPath>
        </defs>
        <g clipPath="url(#roomWindowClip)">
          <rect x="0" y="0" width="120" height="170" fill="url(#roomNightSky)" />
          {WINDOW_STARS.map(([x, y, r], index) => <circle key={index} className="room-window-star" cx={x} cy={y} r={r} fill="#fff" style={{ animationDelay: `${index * 0.4}s` }} />)}
          <circle cx="84" cy="52" r="15" fill="#fff3c4" />
          <circle cx="91" cy="47" r="13" fill="#1b1450" />
        </g>
        <path d="M14 156 V62 A46 46 0 0 1 106 62 V156 Z" fill="none" stroke="#fff" strokeWidth="6" />
        <path d="M60 16 V156 M14 98 H106" stroke="#fff" strokeWidth="4" />
        <path d="M6 20 Q22 60 14 160 L2 160 Q0 80 6 20 Z" fill="#ffb3d1" />
        <path d="M114 20 Q98 60 106 160 L118 160 Q120 80 114 20 Z" fill="#ffb3d1" />
        <rect x="4" y="156" width="112" height="9" rx="3" fill="#fff" stroke="#f4b6cf" strokeWidth="2" />
      </svg>

      <div className="room-lights">
        <svg className="room-wire" viewBox="0 0 100 10" preserveAspectRatio="none">
          <path d={WIRE} fill="none" stroke="#8a6b86" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        {BULBS.map((bulb, index) => (
          <i key={index} className="room-bulb"
            style={{ left: `${bulb.x}%`, top: `${bulb.y * 0.8}vh`, '--c': bulb.color, '--i': index } as CSSProperties} />
        ))}
      </div>

      <div className="room-frames">
        <div className="room-frame room-frame--tall"><img src={asset('hettocumple.webp')} alt="" onError={event => { event.currentTarget.style.display = 'none' }} /></div>
        <div className="room-frame room-frame--square"><img src={asset('hetto-peruana.webp')} alt="" onError={event => { event.currentTarget.style.display = 'none' }} /></div>
        <div className="room-trio">
          {LETTERS.map(letter => (
            <span key={letter.id} className="room-portrait"><MascotFace theme={THEMES[letter.id]} /></span>
          ))}
        </div>
      </div>

      <BalloonBunch className="room-balloons room-balloons--right" colors={RIGHT_BUNCH} />
      <BalloonBunch className="room-balloons room-balloons--left" colors={LEFT_BUNCH} />
      <div className="room-flyer"><img src={asset('cinnamoroll.webp')} alt="" /></div>
      <div className="room-shelf">
        <img src={asset('hello-kitty.webp')} alt="" />
        <i className="room-shelf-board" />
      </div>
      <div className="room-pal room-pal--pompom"><img src={asset('pompompurin.webp')} alt="" /></div>
      <div className="room-pal room-pal--pachacco"><img src={asset('pachacco.webp')} alt="" /></div>
      <div className="room-plush room-plush--kuromi"><img src={character('List-kuromi.webp')} alt="" /></div>
      <div className="room-plush room-plush--melody"><img src={character('mymelody.webp')} alt="" /></div>
      <div className="room-glow" />
    </div>
  )
}

export default RoomBackground