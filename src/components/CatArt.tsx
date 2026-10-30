// Dibujos de gatitos en SVG, para pintarlos con los colores de cada amigo.

const LINE = '#6b4a5a'

type CatColors = { fur: string; ear: string; cheek: string }
type Props = CatColors & { className?: string }

export function CatFace({ fur, ear, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 100 90" aria-hidden="true">
      <path d="M12 40 L18 6 L44 24 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M88 40 L82 6 L56 24 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M20 30 L22 15 L34 24 Z" fill={ear} />
      <path d="M80 30 L78 15 L66 24 Z" fill={ear} />
      <ellipse cx="50" cy="52" rx="40" ry="33" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse className="mascot-eye" cx="34" cy="50" rx="4.2" ry="5.8" fill={LINE} />
      <ellipse className="mascot-eye" cx="66" cy="50" rx="4.2" ry="5.8" fill={LINE} />
      <circle cx="35.5" cy="48" r="1.5" fill="#fff" />
      <circle cx="67.5" cy="48" r="1.5" fill="#fff" />
      <path d="M46 59 h8 l-4 4.5 z" fill={ear} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M50 64 q-4 6 -9 2 M50 64 q4 6 9 2" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="22" cy="62" rx="6.5" ry="4" fill={cheek} opacity=".7" />
      <ellipse cx="78" cy="62" rx="6.5" ry="4" fill={cheek} opacity=".7" />
      <path d="M6 54 L22 57 M6 64 L22 62 M94 54 L78 57 M94 64 L78 62" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Gatito que se asoma por el borde superior de la carta.
export function CatPeek({ fur, ear, cheek, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 160 72" aria-hidden="true">
      <path d="M30 46 L36 4 L66 27 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M130 46 L124 4 L94 27 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M39 33 L41 14 L55 26 Z" fill={ear} />
      <path d="M121 33 L119 14 L105 26 Z" fill={ear} />
      <path d="M18 72 C18 34 48 21 80 21 C112 21 142 34 142 72 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <ellipse className="mascot-eye" cx="58" cy="48" rx="4.4" ry="6" fill={LINE} />
      <ellipse className="mascot-eye" cx="102" cy="48" rx="4.4" ry="6" fill={LINE} />
      <circle cx="59.6" cy="46" r="1.6" fill="#fff" />
      <circle cx="103.6" cy="46" r="1.6" fill="#fff" />
      <path d="M76 56 h8 l-4 4.5 z" fill={ear} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M80 61 q-4 5 -8 2 M80 61 q4 5 8 2" fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="40" cy="58" rx="7" ry="4" fill={cheek} opacity=".7" />
      <ellipse cx="120" cy="58" rx="7" ry="4" fill={cheek} opacity=".7" />
      <ellipse cx="30" cy="68" rx="15" ry="8" fill={fur} stroke={LINE} strokeWidth="3" />
      <ellipse cx="130" cy="68" rx="15" ry="8" fill={fur} stroke={LINE} strokeWidth="3" />
      <path d="M24 66 v4 M30 65 v5 M36 66 v4 M124 66 v4 M130 65 v5 M136 66 v4" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function SleepingCat({ fur, ear, className }: Props) {
  return (
    <svg className={className} viewBox="0 0 170 96" aria-hidden="true">
      <path d="M140 74 C168 74 168 40 144 46" fill="none" stroke={LINE} strokeWidth="14" strokeLinecap="round" />
      <path d="M140 74 C168 74 168 40 144 46" fill="none" stroke={fur} strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="86" cy="68" rx="62" ry="26" fill={fur} stroke={LINE} strokeWidth="3" />
      <path d="M30 50 L32 28 L48 42 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M72 50 L70 28 L54 42 Z" fill={fur} stroke={LINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M35 44 L36 34 L43 41 Z" fill={ear} />
      <path d="M67 44 L66 34 L59 41 Z" fill={ear} />
      <circle cx="51" cy="62" r="24" fill={fur} stroke={LINE} strokeWidth="3" />
      <path d="M38 62 q5 5 10 0 M54 62 q5 5 10 0" fill="none" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M48 70 h6 l-3 3.5 z" fill={ear} stroke={LINE} strokeWidth="1.2" strokeLinejoin="round" />
      <g className="zzz" fill={LINE} fontFamily="Fredoka, sans-serif" fontWeight="700">
        <text x="84" y="34" fontSize="16">z</text>
        <text x="98" y="22" fontSize="12">z</text>
        <text x="108" y="12" fontSize="9">z</text>
      </g>
    </svg>
  )
}

export function PawPrint({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="currentColor">
      <ellipse cx="32" cy="42" rx="14" ry="11" />
      <ellipse cx="13" cy="28" rx="6" ry="8" transform="rotate(-20 13 28)" />
      <ellipse cx="25" cy="16" rx="6" ry="8.5" transform="rotate(-6 25 16)" />
      <ellipse cx="39" cy="16" rx="6" ry="8.5" transform="rotate(6 39 16)" />
      <ellipse cx="51" cy="28" rx="6" ry="8" transform="rotate(20 51 28)" />
    </svg>
  )
}
