import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { BalloonArt, PlaneArt } from './TravelArt'
import useReducedMotion from './useReducedMotion'

// Fondo fijo de la pantalla de Perú: sol con rayos, las mismas nubes que flotan en el cielo de las otras pantallas,
// aves, globos, brillos, los Andes y el grupito BT21 sentado sobre las lomas.

// [alto en %, ancho en px, duración en s, desfase en s, posición en reposo en %]: el mismo tipo de nubes del cielo de la fiesta, cada una en su carril
const CLOUDS = [
  [7, 190, 110, -30, 8], [26, 130, 80, -55, 66], [46, 220, 130, -90, 28], [66, 150, 95, -12, 74],
]
const BIRDS = [
  { top: '18%', left: '24%', size: 26, delay: 0 },
  { top: '14%', left: '30%', size: 19, delay: -.6 },
  { top: '23%', left: '28%', size: 15, delay: -1.2 },
]
const BALLOONS = [
  { left: '6%', top: '38%', size: 62, color: '#ff8fb8', accent: '#ffd0e2', seconds: 9, delay: 0 },
  { left: '88%', top: '46%', size: 52, color: '#7fd8c2', accent: '#d2f6ec', seconds: 11, delay: -4 },
  { left: '74%', top: '16%', size: 40, color: '#ffc46b', accent: '#ffe7b8', seconds: 13, delay: -7 },
]
const SPARKLES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37 + 11) % 97}%`, top: `${(i * 53 + 7) % 70}%`, size: 4 + (i % 4) * 2, delay: -((i * 0.7) % 5),
}))

// Guirnalda de banderines rojiblancos (los colores de Perú) colgada arriba, con un vaivén suave.
const PENNANTS = Array.from({ length: 21 }, (_, i) => {
  const x = 30 + i * 47
  const u = (x % 500) / 500
  return { x, y: 8 + 72 * u * (1 - u) * 0.6, red: i % 2 === 0, delay: -((i * 0.43) % 3) }
})

export function Bunting() {
  return (
    <svg className="peru-bunting" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 8 Q250 52 500 8 Q750 52 1000 8" fill="none" stroke="#ffffffcc" strokeWidth="2.4" />
      {PENNANTS.map(pennant => (
        <path key={pennant.x} className="peru-pennant" d={`M${pennant.x - 15} ${pennant.y} L${pennant.x + 15} ${pennant.y} L${pennant.x} ${pennant.y + 38}Z`}
          fill={pennant.red ? '#e4344e' : '#ffffff'} stroke={pennant.red ? '#c0213a' : '#dbe8f3'} strokeWidth="1.4" strokeLinejoin="round" style={{ animationDelay: `${pennant.delay}s` }} />
      ))}
    </svg>
  )
}

// Los Andes en tres capas. El dibujo mide 1440 × 240 y se ancla abajo, así las cumbres nunca quedan cortadas por arriba.
function Mountains() {
  return (
    <svg className="peru-mountains" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mtn-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d4fa" /><stop offset="1" stopColor="#a9b9ee" /></linearGradient>
        <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a6e4c9" /><stop offset="1" stopColor="#78cfa8" /></linearGradient>
        <linearGradient id="mtn-near" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#74d9a4" /><stop offset="1" stopColor="#47b883" /></linearGradient>
        <linearGradient id="mtn-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".55" /></linearGradient>
      </defs>
      <g transform="scale(1 .6)">
        <path d="M0 400 L0 250 L120 180 L200 230 L330 110 L430 210 L540 150 L680 250 L800 130 L920 220 L1050 100 L1170 200 L1290 150 L1440 240 L1440 400Z" fill="url(#mtn-far)" />
        <g fill="#8fa0dd" opacity=".35">
          <path d="M330 110 L430 210 L380 230 L345 150Z" />
          <path d="M800 130 L920 220 L860 240 L815 160Z" />
          <path d="M1050 100 L1170 200 L1110 225 L1065 140Z" />
        </g>
        <g fill="#fff" opacity=".96">
          <path d="M300 144 L330 110 L362 146 L346 139 L330 153 L316 140Z" />
          <path d="M772 160 L800 130 L830 162 L815 155 L800 168 L786 154Z" />
          <path d="M1020 132 L1050 100 L1082 134 L1066 127 L1050 141 L1036 128Z" />
        </g>
        <rect x="0" y="230" width="1440" height="170" fill="url(#mtn-haze)" />
        <path d="M0 400 L0 300 L150 240 L300 290 L460 230 L620 300 L780 250 L960 310 L1120 240 L1300 295 L1440 250 L1440 400Z" fill="url(#mtn-mid)" />
        {/* andenes: las terrazas de cultivo de los Andes */}
        <g stroke="#c4f2dc" strokeWidth="2.2" fill="none" opacity=".7" strokeLinecap="round">
          <path d="M470 252 Q530 262 600 290" /><path d="M485 268 Q540 278 606 300" />
          <path d="M1130 262 Q1190 268 1260 290" /><path d="M1140 278 Q1195 284 1270 302" />
          <path d="M170 254 Q220 262 280 290" />
        </g>
        <path d="M0 400 L0 345 Q200 292 420 338 T860 332 T1300 326 L1440 336 L1440 400Z" fill="url(#mtn-near)" />
      </g>
    </svg>
  )
}

function PeruScene() {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  // Parallax: los cerros y el grupito BT21 empiezan un poco escondidos abajo y suben a medida que bajas por la página,
  // hasta verse COMPLETOS al llegar al final. --peru-p va de 0 (arriba de todo) a 1 (abajo de todo).
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduce) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--peru-p', (max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1).toFixed(3))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const settle = window.setTimeout(update, 600)   // la altura de la página termina de calcularse cuando entra el contenido
    return () => { cancelAnimationFrame(frame); window.clearTimeout(settle); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [reduce])
  return (
    <div className="peru-scene" ref={rootRef} aria-hidden="true">
      <div className="peru-sun"><i /></div>
      {CLOUDS.map(([top, width, duration, delay, rest], index) => (
        <div key={index} className="sky-cloud"
          style={{ top: `${top}%`, '--rest': `${rest}%`, '--w': `${width}px`, animationDuration: `${duration}s, ${5 + index}s`, animationDelay: `${delay}s, ${-index * 1.3}s` } as CSSProperties} />
      ))}
      {BIRDS.map(bird => (
        <svg key={bird.top} className="peru-bird" viewBox="0 0 40 20" style={{ top: bird.top, left: bird.left, width: bird.size, animationDelay: `${bird.delay}s` }}>
          <path d="M2 14 Q10 2 20 12 Q30 2 38 14" fill="none" stroke="#6b86b5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
      <span className="peru-flyby"><PlaneArt /></span>
      {BALLOONS.map(balloon => (
        <BalloonArt key={balloon.left} className="peru-balloon" color={balloon.color} accent={balloon.accent}
          style={{ left: balloon.left, top: balloon.top, width: balloon.size, animationDuration: `${balloon.seconds}s`, animationDelay: `${balloon.delay}s` }} />
      ))}
      {SPARKLES.map((sparkle, index) => (
        <i key={index} className="peru-sparkle" style={{ left: sparkle.left, top: sparkle.top, width: sparkle.size, height: sparkle.size, animationDelay: `${sparkle.delay}s` }} />
      ))}
      <Mountains />
      <img className="peru-crew" src={import.meta.env.BASE_URL + 'images/personaje/bt21.png'} alt="" onError={event => { event.currentTarget.style.display = 'none' }} />
    </div>
  )
}

export default PeruScene
