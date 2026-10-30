// Dibujos en SVG de un espíritu del bosque redondo y gris, inspirado en Totoro, con los colores de cada amigo.
// fur = cuerpo, ear = panza, cheek = mejillas.

const LINE = '#4a5565'

type Colors = { fur: string; ear: string; cheek: string }
type Props = Colors & { className?: string }

// Rayitas en forma de V de la panza.
function Chevrons({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity=".38">
      <path d={`M${x - 16} ${y} l6 5 l6 -5`} />
      <path d={`M${x - 3} ${y - 4} l6 5 l6 -5`} />
      <path d={`M${x + 8} ${y + 4} l6 5 l6 -5`} />
      <path d={`M${x - 8} ${y + 12} l6 5 l6 -5`} />
    </g>
  )
}

export function TotoroFace({ fur, ear, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M22 40 L16 4 L42 24 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M78 40 L84 4 L58 24 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="50" cy="60" rx="43" ry="37" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="50" cy="78" rx="30" ry="19" fill={ear} />
      <Chevrons x={44} y={76} />
      <circle className="mascot-eye" cx="28" cy="48" r="3.4" fill={LINE} />
      <circle className="mascot-eye" cx="72" cy="48" r="3.4" fill={LINE} />
      <circle cx="29.2" cy="46.8" r="1.1" fill="#fff" />
      <circle cx="73.2" cy="46.8" r="1.1" fill="#fff" />
      <ellipse cx="50" cy="48" rx="7.5" ry="4.8" fill={LINE} />
      <path d="M30 56 Q50 76 70 56 Q50 62 30 56 Z" fill="#fff" stroke={LINE} strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="20" cy="60" rx="5.5" ry="3.6" fill={cheek} opacity=".75" />
      <ellipse cx="80" cy="60" rx="5.5" ry="3.6" fill={cheek} opacity=".75" />
      <path d="M12 50 L26 53 M10 58 L26 57 M88 50 L74 53 M90 58 L74 57" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Asomándose por el borde superior de la carta.
export function TotoroPeek({ fur, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 160 72" aria-hidden="true">
      <path d="M36 46 L30 2 L64 28 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M124 46 L130 2 L96 28 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 72 C14 34 46 20 80 20 C114 20 146 34 146 72 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <circle className="mascot-eye" cx="50" cy="46" r="3.6" fill={LINE} />
      <circle className="mascot-eye" cx="110" cy="46" r="3.6" fill={LINE} />
      <circle cx="51.2" cy="44.8" r="1.2" fill="#fff" />
      <circle cx="111.2" cy="44.8" r="1.2" fill="#fff" />
      <ellipse cx="80" cy="45" rx="8" ry="5" fill={LINE} />
      <path d="M56 54 Q80 72 104 54 Q80 61 56 54 Z" fill="#fff" stroke={LINE} strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="38" cy="56" rx="6" ry="3.8" fill={cheek} opacity=".75" />
      <ellipse cx="122" cy="56" rx="6" ry="3.8" fill={cheek} opacity=".75" />
      <path d="M22 50 L40 53 M20 58 L40 57 M138 50 L120 53 M140 58 L120 57" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="28" cy="68" rx="15" ry="8" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="132" cy="68" rx="15" ry="8" fill={fur} stroke={LINE} strokeWidth="3" />
      <path d="M22 66 v4 M28 65 v5 M34 66 v4 M126 66 v4 M132 65 v5 M138 66 v4" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Dormido, con una hojita en la cabeza.
export function SleepingTotoro({ fur, ear, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 150 128" aria-hidden="true">
      <path d="M40 38 L32 6 L64 26 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M110 38 L118 6 L86 26 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="46" cy="120" rx="18" ry="7" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="104" cy="120" rx="18" ry="7" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="75" cy="74" rx="58" ry="48" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="75" cy="94" rx="40" ry="28" fill={ear} />
      <Chevrons x={68} y={92} />
      <path d="M36 62 q7 6 14 0 M100 62 q7 6 14 0" fill="none" stroke={LINE} strokeWidth="2.6" strokeLinecap="round" />
      <ellipse cx="75" cy="60" rx="8.5" ry="5.4" fill={LINE} />
      <path d="M58 70 Q75 84 92 70 Q75 76 58 70 Z" fill="#fff" stroke={LINE} strokeWidth="2.4" strokeLinejoin="round" />
      <ellipse cx="30" cy="70" rx="6.5" ry="4" fill={cheek} opacity=".75" />
      <ellipse cx="120" cy="70" rx="6.5" ry="4" fill={cheek} opacity=".75" />
      <path d="M86 28 c-2 -16 14 -24 30 -16 c2 14 -10 24 -30 16 z" fill="#9fe3c2" stroke={LINE} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M90 26 q12 -4 22 -12" fill="none" stroke={LINE} strokeWidth="1.8" strokeLinecap="round" />
      <g className="zzz" fill={LINE} fontFamily="Fredoka, sans-serif" fontWeight="700">
        <text x="124" y="44" fontSize="16">z</text>
        <text x="136" y="32" fontSize="12">z</text>
        <text x="143" y="22" fontSize="9">z</text>
      </g>
    </svg>
  )
}

export function Leaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M10 54 C6 24 26 6 56 8 C58 38 40 58 10 54 Z" fill="currentColor" />
      <path d="M12 52 C24 40 36 28 48 16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </svg>
  )
}

// Bolita de hollín: pequeña, peluda y con ojos grandes.
export function SootSprite({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <g stroke="#565a72" strokeWidth="3" strokeLinecap="round">
        <path d="M32 6 V16 M32 48 V58 M6 32 H16 M48 32 H58 M14 14 L21 21 M43 43 L50 50 M50 14 L43 21 M21 43 L14 50" />
      </g>
      <circle cx="32" cy="32" r="20" fill="#565a72" />
      <circle cx="25" cy="29" r="6" fill="#fff" />
      <circle cx="39" cy="29" r="6" fill="#fff" />
      <circle cx="26" cy="30" r="2.6" fill="#2d2f3f" />
      <circle cx="38" cy="30" r="2.6" fill="#2d2f3f" />
    </svg>
  )
}
