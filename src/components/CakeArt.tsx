import type { RefObject } from 'react'

const LINE = '#6b4a5a'

type Props = {
  lit: boolean
  onCandle?: () => void
  // Para saber dónde está la llama y alumbrar desde ahí.
  flameRef?: RefObject<SVGGElement | null>
}

function Strawberry({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 -4 C-14 -10 -17 6 0 20 C17 6 14 -10 0 -4 Z" fill="#ff6b8e" stroke={LINE} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M-8 -5 q8 -8 16 0 q-8 4 -16 0 Z" fill="#7ed9a6" stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="-6" cy="3" rx="2" ry="4" fill="#fff" opacity=".35" transform="rotate(14 -6 3)" />
      <g fill="#ffe3ea">
        <ellipse cx="-5" cy="4" rx="1.3" ry="2" />
        <ellipse cx="4" cy="2" rx="1.3" ry="2" />
        <ellipse cx="0" cy="11" rx="1.3" ry="2" />
      </g>
    </g>
  )
}

// Rosetón de crema con una perla encima
function Rosette({ x, y, color = '#fff' }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-9 4 Q-10 -4 -4 -6 Q0 -12 4 -6 Q10 -4 9 4 Q0 9 -9 4 Z" fill={color} stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M-4 0 Q0 -4 4 0" fill="none" stroke={LINE} strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
    </g>
  )
}

function Heart({ x, y, s = 1, color = '#ff8fb8' }: { x: number; y: number; s?: number; color?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 3 C-6 -2 -6 -7 -2.5 -7 C-1 -7 0 -6 0 -5 C0 -6 1 -7 2.5 -7 C6 -7 6 -2 0 3 Z" fill={color} />
}

// Perlas de azúcar a lo largo de la base de un piso
function Pearls({ from, to, y }: { from: number; to: number; y: number }) {
  const count = Math.round((to - from) / 14)
  return (
    <g fill="#fff" stroke="#e7b6cb" strokeWidth="1.2">
      {Array.from({ length: count }, (_, index) => <circle key={index} cx={from + 7 + index * ((to - from - 14) / (count - 1))} cy={y} r="3.6" />)}
    </g>
  )
}

// Pastel de dos pisos con degradados, perlas, rosetas de crema, fresas, "Hetto" en glaseado y una velita.
// Al apagarse la vela sale humo y desaparece el brillo.
function CakeArt({ lit, onCandle, flameRef }: Props) {
  return (
    <svg className={`cake-svg ${lit ? 'is-lit' : 'is-out'}`} viewBox="0 0 260 270" role="img" aria-label="Pastel de cumpleaños con una vela">
      <defs>
        <radialGradient id="cakeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3b0" stopOpacity=".95" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cakeLow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb4d0" />
          <stop offset=".35" stopColor="#ffd3e4" />
          <stop offset="1" stopColor="#ffb0cd" />
        </linearGradient>
        <linearGradient id="cakeUp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9baff" />
          <stop offset=".35" stopColor="#e6dcff" />
          <stop offset="1" stopColor="#c4b3fb" />
        </linearGradient>
      </defs>
      <circle className="cake-glow" cx="130" cy="44" r="74" fill="url(#cakeGlow)" />

      {/* plato con borde de encaje */}
      <ellipse cx="130" cy="252" rx="120" ry="14" fill="#fff" stroke="#f4b6cf" strokeWidth="3" />
      <ellipse cx="130" cy="250" rx="104" ry="9" fill="none" stroke="#f9d3e2" strokeWidth="2" strokeDasharray="3 6" />

      {/* piso de abajo */}
      <rect x="28" y="156" width="204" height="92" rx="24" fill="url(#cakeLow)" stroke={LINE} strokeWidth="3" />
      <path d="M28 176 Q28 156 52 156 H208 Q232 156 232 176 q-10 14 -22 0 q-10 20 -22 0 q-10 14 -22 0 q-10 20 -22 0 q-10 14 -22 0 q-10 20 -22 0 q-10 14 -22 0 q-10 20 -22 0 q-12 16 -26 0 Z"
        fill="#fff" stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M44 214 q-3 12 4 24" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".5" />
      <Pearls from={40} to={220} y={240} />

      {/* piso de arriba */}
      <rect x="66" y="92" width="128" height="70" rx="20" fill="url(#cakeUp)" stroke={LINE} strokeWidth="3" />
      <path d="M66 112 Q66 92 86 92 H174 Q194 92 194 112 q-8 12 -20 0 q-9 18 -21 0 q-9 12 -21 0 q-9 18 -21 0 q-9 12 -21 0 q-10 16 -24 0 Z"
        fill="#fff" stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M76 124 q-2 14 3 26" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" opacity=".5" />
      <Pearls from={74} to={186} y={160} />

      <text x="130" y="143" textAnchor="middle" fontFamily="'Dancing Script', 'Caveat', cursive" fontWeight="700" fontSize="25"
        fill="#fff" stroke="#c0457a" strokeWidth="1.6" paintOrder="stroke" strokeLinejoin="round">Hetto ♡</text>

      {/* confeti de azúcar y corazones sobre el piso de abajo */}
      <g fill="#ffb3cd">
        <rect x="44" y="190" width="9" height="3.4" rx="1.7" transform="rotate(-24 48 192)" />
        <rect x="206" y="222" width="9" height="3.4" rx="1.7" transform="rotate(30 210 224)" />
      </g>
      <g fill="#9be3c4">
        <rect x="204" y="190" width="9" height="3.4" rx="1.7" transform="rotate(-30 208 192)" />
        <rect x="52" y="224" width="9" height="3.4" rx="1.7" transform="rotate(18 56 226)" />
      </g>
      <g fill="#ffd27a">
        <rect x="42" y="208" width="9" height="3.4" rx="1.7" transform="rotate(40 46 210)" />
        <rect x="214" y="206" width="9" height="3.4" rx="1.7" transform="rotate(-10 218 208)" />
      </g>
      <Heart x={70} y={194} s={1.3} />
      <Heart x={190} y={196} s={1.3} color="#b79cf2" />
      <Heart x={62} y={228} s={1} color="#9be3c4" />
      <Heart x={198} y={228} s={1} color="#ffd27a" />

      {/* rosetas de crema en los hombros del piso de abajo */}
      <Rosette x={46} y={160} color="#fff" />
      <Rosette x={214} y={160} color="#fff" />
      <circle cx="46" cy="148" r="5" fill="#ff5c7e" stroke={LINE} strokeWidth="1.8" />
      <circle cx="214" cy="148" r="5" fill="#ff5c7e" stroke={LINE} strokeWidth="1.8" />

      <Strawberry x={84} y={94} />
      <Strawberry x={176} y={94} />

      {/* carita */}
      <ellipse cx="102" cy="208" rx="5" ry="7" fill={LINE} />
      <ellipse cx="158" cy="208" rx="5" ry="7" fill={LINE} />
      <circle cx="103.6" cy="205.6" r="1.7" fill="#fff" />
      <circle cx="159.6" cy="205.6" r="1.7" fill="#fff" />
      <path d="M120 217 q10 10 20 0" fill="none" stroke={LINE} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="84" cy="218" rx="9" ry="5.5" fill="#ff9fc0" opacity=".7" />
      <ellipse cx="176" cy="218" rx="9" ry="5.5" fill="#ff9fc0" opacity=".7" />

      <g className="cake-candle" onClick={onCandle} style={{ cursor: lit && onCandle ? 'pointer' : 'default' }}>
        <rect x="122" y="56" width="16" height="40" rx="5" fill="#fff" stroke={LINE} strokeWidth="3" />
        <path d="M123 68 l14 -6 M123 80 l14 -6 M123 92 l14 -6" stroke="#ff9fc0" strokeWidth="4" strokeLinecap="round" />
        <path d="M130 56 v-7" stroke={LINE} strokeWidth="3" strokeLinecap="round" />
        <g className="cake-flame" ref={flameRef} style={{ transformOrigin: '130px 52px' }}>
          <path d="M130 18 C145 34 142 52 130 52 C118 52 115 34 130 18 Z" fill="#ffb347" stroke={LINE} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M130 31 C137 40 136 49 130 49 C124 49 123 40 130 31 Z" fill="#ffe58a" />
        </g>
        <rect x="104" y="12" width="52" height="86" fill="transparent" />
      </g>

      <g className="cake-smoke" fill="#fff" stroke="#d9cfe6" strokeWidth="1.5">
        <circle cx="130" cy="44" r="6" />
        <circle cx="136" cy="34" r="8" />
        <circle cx="126" cy="22" r="10" />
      </g>
    </svg>
  )
}

export default CakeArt
