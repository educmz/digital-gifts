import type { Theme } from '../content'
import { CatFace, CatPeek, PawPrint, SleepingCat } from './CatArt'
import { PenguinFace, PenguinPeek, SleepingPenguin, Snowflake } from './PenguinArt'
import { Leaf, SleepingTotoro, SootSprite, TotoroFace, TotoroPeek } from './TotoroArt'

// Elige el dibujo (gatito, pingüino o espíritu del bosque) según la mascota de cada amigo.
type Props = { theme: Theme; className?: string }

const colors = (theme: Theme) => ({ fur: theme.fur, ear: theme.ear, cheek: theme.cheek })

export function MascotFace({ theme, className }: Props) {
  const c = colors(theme)
  if (theme.critter === 'penguin') return <PenguinFace {...c} className={className} />
  if (theme.critter === 'totoro') return <TotoroFace {...c} className={className} />
  return <CatFace {...c} className={className} />
}

export function MascotPeek({ theme, className }: Props) {
  const c = colors(theme)
  if (theme.critter === 'penguin') return <PenguinPeek {...c} className={className} />
  if (theme.critter === 'totoro') return <TotoroPeek {...c} className={className} />
  return <CatPeek {...c} className={className} />
}

export function MascotSleeping({ theme, className }: Props) {
  const c = colors(theme)
  if (theme.critter === 'penguin') return <SleepingPenguin {...c} className={className} />
  if (theme.critter === 'totoro') return <SleepingTotoro {...c} className={className} />
  return <SleepingCat {...c} className={className} />
}

// Adorno repetido en los caminitos y en lo que flota: huellitas, copos de nieve u hojas.
export function MascotTrail({ theme, className }: Props) {
  if (theme.critter === 'penguin') return <Snowflake className={className} />
  if (theme.critter === 'totoro') return <Leaf className={className} />
  return <PawPrint className={className} />
}

// Adorno extra que solo tienen algunas mascotas (bolitas de hollín del bosque).
export function MascotExtra({ theme, className }: Props) {
  return theme.critter === 'totoro' ? <SootSprite className={className} /> : <MascotTrail theme={theme} className={className} />
}
