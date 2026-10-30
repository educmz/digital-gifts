// Personalización: edita aquí los nombres, textos y estilos de las secciones.
// Todo lo marcado como "EJEMPLO" es texto de relleno: reemplázalo por lo tuyo.

export const RECIPIENT = 'Hetto'

export type FriendId = 'pum' | 'lynki' | 'giank'

export type Theme = {
  critter: 'cat' | 'penguin' | 'totoro'  // mascota de la carta
  paper: string   // papel de la carta y del sobre
  edge: string    // bordes, solapa y cinta
  accent: string  // detalles, firma, adornos flotantes
  ink: string     // color del texto
  bg1: string     // fondo (arriba)
  bg2: string     // fondo (abajo)
  fur: string     // color del cuerpo de la mascota
  ear: string     // gatito: interior de orejas y nariz · pingüino: pico y patitas · Totoro: panza
  cheek: string   // mejillas
}

// Paletas pastel, una por amigo.
export const THEMES: Record<FriendId, Theme> = {
  pum: { critter: 'cat', paper: '#fff4f8', edge: '#ffc4d9', accent: '#f58bb0', ink: '#7a3550', bg1: '#ffe9f1', bg2: '#ffcfe1', fur: '#ffffff', ear: '#ffb3cd', cheek: '#ffb3c7' },
  lynki: { critter: 'penguin', paper: '#f7f3ff', edge: '#d6c8ff', accent: '#9b82ee', ink: '#47397a', bg1: '#efe8ff', bg2: '#d9ccff', fur: '#a79fd6', ear: '#ffb870', cheek: '#ffbfd8' },
  giank: { critter: 'totoro', paper: '#f1fcf7', edge: '#b9ebd7', accent: '#4fc29a', ink: '#2c5c4b', bg1: '#e2f8ee', bg2: '#c6efdf', fur: '#a9b9cc', ear: '#fff4d9', cheek: '#ffb8c4' },
}

export type StickerSlot = {
  src: string          // archivo dentro de public/images/stickers/
  alt: string
  size: number         // tamaño en px (en celular se reduce solo)
  rotate: number       // inclinación en grados
  // Posición respecto al papel: número = px, texto = porcentaje u otra unidad.
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  desktopOnly?: boolean
}

// Seis espacios para stickers por carta: 4 en las esquinas y 2 en los márgenes (solo escritorio).
// Mientras no exista el archivo, se muestra un gatito de relleno.
// Para usar los tuyos: guarda las imágenes (PNG con fondo transparente) en public/images/stickers/
// con los nombres pum-1.png … pum-6.png, lynki-1.png … y giank-1.png …
function stickersFor(id: FriendId): StickerSlot[] {
  const slots: Omit<StickerSlot, 'src' | 'alt'>[] = [
    { top: -34, left: -26, size: 118, rotate: -12 },
    { top: -34, right: -26, size: 108, rotate: 10 },
    { bottom: 46, left: -26, size: 108, rotate: 8 },
    { bottom: 46, right: -26, size: 118, rotate: -8 },
    { top: '26%', left: -165, size: 132, rotate: -6, desktopOnly: true },
    { top: '60%', right: -165, size: 132, rotate: 7, desktopOnly: true },
  ]
  return slots.map((slot, index) => ({ ...slot, src: `stickers/${id}-${index + 1}.png`, alt: `Sticker ${index + 1}` }))
}

export type Letter = {
  id: FriendId
  name: string
  title: string
  subtitle: string
  paragraphs: string[]
  signature: string
  stickers: StickerSlot[]
}

export const LETTERS: Letter[] = [
  {
    id: 'pum',
    name: 'Pum',
    title: 'Para Hetto, con cariño',
    subtitle: 'Una carta de Pum, especialmente para ti',
    paragraphs: [
      'Querida Hetto:',
      'Hoy quería regalarte algo distinto. No algo que se abra una sola vez y después se guarde en un cajón, sino unas palabras a las que puedas volver cuando quieras. Una pequeña carta para recordarte lo mucho que mereces sentirte querida, acompañada y feliz.',
      'Me gusta pensar que hay personas capaces de volver especiales los momentos más simples. A veces no hace falta un gran plan ni una ocasión extraordinaria: basta con una conversación que se alarga sin darnos cuenta, una risa inesperada o esa tranquilidad de poder ser uno mismo.',
      'Contigo he aprendido a apreciar todavía más esos pequeños instantes. Los que parecen cotidianos mientras suceden, pero después se convierten en recuerdos a los que uno vuelve con una sonrisa. Ojalá nunca olvidemos lo valioso que puede ser un día cualquiera.',
      'Hay tantas cosas que me gustaría desearte en tu cumpleaños que seguramente ninguna carta alcanzaría. Quiero que tengas días ligeros, de esos en los que todo parece acomodarse. Que encuentres motivos para reír incluso cuando la semana se ponga difícil y que nunca falten sueños que te hagan ilusión.',
      'También te deseo paciencia contigo misma. Que puedas celebrar cada paso que das, incluso los pequeños, incluso esos que nadie más ve. Que no te exijas tener todas las respuestas ahora y que te permitas descubrir cosas nuevas sin miedo a equivocarte.',
      'Espero que este nuevo año te regale aventuras, lugares que todavía no conoces, canciones que se vuelvan favoritas y momentos tan bonitos que desees detener el tiempo un ratito. Y también días tranquilos, porque la felicidad a veces llega sin hacer ruido.',
      'Gracias por tu manera de ser, por los detalles que quizá para ti pasan desapercibidos y por la alegría que compartes. Gracias por las conversaciones, por las risas y por esos instantes que se quedan guardados aunque no les hayamos tomado una fotografía.',
      'Si algún día todo se siente demasiado pesado, espero que al leer esto recuerdes que no tienes que convertir cada día en algo perfecto. Está bien descansar, empezar de nuevo y avanzar a tu propio ritmo. Lo importante es que no pierdas esa parte de ti que hace que el mundo se sienta un poquito más cálido.',
      'Me hace ilusión pensar en todos los recuerdos que todavía faltan. En las fotos que aún no hemos tomado, en los lugares que nos harán reír, en las historias que contaremos una y otra vez y en las pequeñas tradiciones que quizá aparezcan sin planearlas.',
      'Quiero que recuerdes que las cosas bonitas no siempre llegan como las imaginamos. A veces se esconden en un mensaje a mitad del día, en una mirada cómplice o en una tarde que empezó sin planes y terminó siendo inolvidable. Ojalá podamos seguir reconociéndolas.',
      'Y cuando mires hacia atrás, espero que veas mucho más que fechas y acontecimientos. Que veas cuánto has crecido, cuánto has aprendido, cuántas veces seguiste adelante y cuántas personas han tenido la suerte de coincidir contigo.',
      'Si pudiera guardar un deseo especial dentro de esta carta, sería que nunca dudes del cariño que mereces. Que te rodeen personas que escuchen tus historias, celebren tus logros, te acompañen en los días grises y quieran verte brillar sin pedirte que seas diferente.',
      'Me gustaría que cada cumpleaños fuera también una oportunidad para agradecer lo vivido. Incluso lo imperfecto, porque muchas veces de allí nacen las lecciones más importantes, las anécdotas más divertidas y las versiones de nosotros mismos que aprendemos a querer.',
      'Quizá cuando vuelvas a abrir esta página hayan pasado semanas, meses o mucho más tiempo. Tal vez algunas cosas sean distintas. Pero espero que estas palabras sigan recordándote lo mismo: hoy, y cada vez que las leas, deseo de corazón que estés bien.',
      'Gracias por estar aquí, por ser tú y por hacer que tantos momentos merezcan recordarse. Que la vida te sorprenda de las formas más bonitas y que nunca falte una razón para seguir soñando.',
      'Feliz cumpleaños, Hetto. Que este sea un capítulo lleno de luz, cariño, aventuras y recuerdos inolvidables. Y que cuando termine, tengas muchísimas historias nuevas que contar.',
      'Con muchísimo cariño, para ti. ♡',
    ],
    signature: 'Pum',
    stickers: stickersFor('pum'),
  },
  // EJEMPLO: reemplaza este texto por la carta real de Lynki.
  {
    id: 'lynki',
    name: 'Lynki',
    title: 'Para Hetto, con muchas ganas',
    subtitle: 'Una carta de Lynki, especialmente para ti',
    paragraphs: [
      'Querida Hetto:',
      'Hoy es tu día y quería escribirte algo que pudieras guardar. No tengo la costumbre de poner en palabras lo que siento, pero contigo siempre me dan ganas de intentarlo.',
      'Gracias por ser de esas personas que hacen que uno se sienta bienvenido desde el primer momento. Por escucharme, por reírte conmigo y por esos ratitos que vuelven más ligeros hasta los días pesados.',
      'Te deseo un año lleno de cosas lindas: mañanas tranquilas, buena música, sorpresas que te saquen una sonrisa y mucha gente que te quiera tanto como te queremos nosotros.',
      'Que te animes a todo lo que tengas pendiente, que descanses cuando lo necesites y que nunca dejes de ser tan tú.',
      'Feliz cumpleaños, Hetto. Gracias por existir y por dejarme ser parte de tu vida. ♡',
    ],
    signature: 'Lynki',
    stickers: stickersFor('lynki'),
  },
  {
    id: 'giank',
    name: 'Giank',
    title: 'Para Hetto, con todo mi cariño',
    subtitle: 'Una carta de Giank, especialmente para ti',
    paragraphs: [
      'Holaaa jefecitaaa',
      'espero que hayas pasado un muy feliz cumpleaños junto a tu familia, sabes que te quiero y aprecio muchisimo',
      'me alegro habernos podido conocer ya que eres bien loca y chevere',
      'tu sabes que cuando se junta la banda siempre hay desmadre del bueno 67676767',
      'pero espero que ya vengas a Peru para podernos conocer en persona, salir a comer con toda la banda',
      'pero solo no me racees porque soy marron, cualquier cosa tu sabes solo avisame e intentare ayudarte',
      'feliz 80 años abuela cheetos',
    ],
    signature: 'Giank',
    stickers: stickersFor('giank'),
  },
]

// EJEMPLO: mensajes cortos de cada amigo (sección "Tres corazones para ti").
export const FRIENDS: { id: FriendId; name: string; message: string }[] = [
  {
    id: 'pum',
    name: 'Pum',
    message: 'Gracias por ser de esas personas que vuelven especial cualquier día. Que este año te regale todo lo bonito que mereces. ¡Te quiero un montón!',
  },
  {
    id: 'lynki',
    name: 'Lynki',
    message: 'Contigo hasta los planes más simples se convierten en recuerdos. Ojalá nunca se acaben las risas ni las historias para contar.',
  },
  {
    id: 'giank',
    name: 'Giank',
    message: 'Hoy toca celebrarte a ti. Gracias por tu alegría, por tu cariño y por estar siempre. ¡Feliz cumpleaños!',
  },
]

// EJEMPLO: razones por las que es increíble (se muestran como tarjetas que se voltean).
export const REASONS = [
  { symbol: '☺', title: 'Tu risa', text: 'Se contagia y mejora cualquier momento.' },
  { symbol: '♥', title: 'Tu cariño', text: 'Con los detalles más pequeños haces que los demás se sientan queridos.' },
  { symbol: '✦', title: 'Tu energía', text: 'Iluminas el ambiente apenas llegas.' },
  { symbol: '♪', title: 'Tu compañía', text: 'Contigo siempre hay una conversación que se alarga sin darnos cuenta.' },
  { symbol: '✿', title: 'Tu forma de ser', text: 'Auténtica, cálida y única. No cambies nunca.' },
  { symbol: '☀', title: 'Tu apoyo', text: 'En los días buenos y en los difíciles, siempre estás.' },
]

// EJEMPLO: vales que ella puede "canjear". Cada vale indica de parte de quién es (por posición en FRIENDS).
export const VOUCHERS = [
  { title: 'Un helado a tu elección', from: FRIENDS[0].name },
  { title: 'Una tarde de películas y snacks', from: FRIENDS[1].name },
  { title: 'Un abrazo gigante, sin límite de tiempo', from: FRIENDS[2].name },
]
