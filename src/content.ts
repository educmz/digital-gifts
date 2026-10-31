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
      'Amorchitoooo hermoshooooooooo, ¡feliz cumpleaños, mamasotata! Wuuuuuuuuuu. 💗',
      'Estoy muy feliz de ver el cambio tan grande que has tenido desde que te conocí. Has crecido muchísimo como persona, como mamá y como amiga, y muak, te amo.',
      'Recuerdo mucho esas noches en las que nos poníamos a chismear de todooooo, todos esos momentos extraños que pasamos juntas y también los que vivíamos de forma individual, ajdjad. Viendo películas exóticas, jugando un montón y, sobre todo, haber podido acompañarte cuando querías jugar Valorant competitivamente.',
      'Eres una persona con un corazón enorme, porque, a pesar de haber pasado por muchos momentos complicados en tu vida, sigues confiando y entregando tu corazón a las personas que conoces.',
      'Ahora que eres mami y que, claramente, tienes mucho menos tiempo, siempre buscas la manera de acompañarme y estar presente para los demás, y eso habla muchísimo de ti. Recuerdo esos días en los que la pasaba re mal y tú estabas ahí para escucharme, o cuando me presentabas a tus amigos todos raritos, JAJAJAJA.',
      'No cambies nunca. Sigue siendo esa chica súper risueña a la que le encantan los ambientes graciosos, esa chica que desde pequeñita siempre ha buscado la manera de salir adelante.',
      'Solo me queda decirte que espero de corazón que podamos vernos algún día y seguir compartiendo muchísimos más momentos, hasta que seamos abuelitas. Porque te amo demasiado como amiga, y no quiero que me sueltes, así como yo tampoco quiero soltarte.',
      '¡Feliz cumpleaños, mi amor! Espero que la vida te siga regalando muchísimos motivos para sonreír. Te mereces todo lo bonito del mundo. Muak, muak. 💗',
    ],
    signature: 'Pum',
    stickers: stickersFor('pum'),
  },
  {
    id: 'lynki',
    name: 'Lynkii',
    title: 'Para Hetto, con muchas ganas',
    subtitle: 'Una carta de Lynkii, especialmente para ti',
    paragraphs: [
      'Merchi, bueno, vtuber de mrd. Aunque tu cumpleaños ya pasó y ya te había felicitado, quería aprovechar esta sorpresa para decirte algunas cosas que quizá no te digo tan seguido.',
      'Quién diría que por Discord, en el servidor de Zoe, terminaría conociendo a alguien como tú. Aunque estemos en países distintos y no tengamos tantas experiencias juntos en persona, me alegra mucho haberte conocido y que, poco a poco, te hayas convertido en una amiga a la que le tengo tanto cariño y aprecio.',
      'Una de las cosas que más me gustan de ti es tu forma de ser. Me encanta que seas tan auténtica, que no te dé miedo decir lo que piensas ni mostrarte tal y como eres. Siento que eres una persona muy real, no necesitas fingir nada para caer bien. Y, sobre todo, me gusta esa alegría que tienes y que se contagia cada vez que estamos en llamada. No sé si te das cuenta, pero muchas veces basta con que estés ahí, hablando o haciendo alguna de tus tonterías, hace que todo sea mucho más divertido.',
      'Me gustaba cuando jugábamos Valo, molestarnos por cualquier tontería y pasarla bien con los demás. Al final, son esas pequeñas cosas las que hacen bonita una amistad. Y sí, probablemente voy a seguir llamándote vtuber de mrd por el resto de mi vida. (#freeHETTO)',
      'Pero fuera de bromas, también quiero agradecerte por haber estado para mí cuando no me encontraba bien. Por escucharme, por darme la confianza de contarte cosas y por hacerme sentir que puedo hablar contigo cuando lo necesito y aconsejarme cuando ni yo mismo sabía cómo llevar la situación. Quizá no siempre encuentre las palabras para decirlo, pero valoro mucho que hayas sido esa amiga con la que puedo compartir tanto los momentos buenos como aquellos en los que las cosas no van tan bien. No todo el mundo consigue transmitir esa confianza, y me alegra que contigo pueda sentirla.',
      'Quiero que sepas que te aprecio muchísimo y que me alegra tenerte en mi vida, incluso con la distancia de por medio. Espero que este nuevo año de vida te traiga muchas cosas bonitas, momentos que te hagan feliz, personas que te quieran de verdad y un montón de motivos para seguir siendo esa down que conocí por Discord.',
      'Y aunque esta carta llegue después de tu cumpleaños, creo que nunca está de más recordarle a alguien lo mucho que se le aprecia. Así que esta sorpresa no es solo por tu cumpleaños, sino también porque eres una buena amiga y mereces saber que hay personas que agradecen tenerte cerca, aunque sea a través de una pantalla.',
      'Te quiero mucho, Merchi. Gracias por las risas, las bromas, la confianza y por ser tú misma. Ojalá sigamos compartiendo muchas más partidas, llamadas y momentos que algún día podamos recordar y de los que nos podamos reír juntos.',
      '¡Feliz cumpleaños atrasado!',
      'Alias edit by Lynkii, futuro editor de Carly.',
    ],
    signature: 'Lynkii',
    stickers: stickersFor('lynki'),
  },
  {
    id: 'giank',
    name: 'Giank',
    title: 'Para Hetto, con todo mi cariño',
    subtitle: 'Una carta de Giank, especialmente para ti',
    paragraphs: [
      'Holaaa, jefecitaaa. Espero que hayas pasado un muy feliz cumpleaños junto a tu familia. Sabes que te quiero y te aprecio muchísimo. Me alegra mucho que hayamos podido conocernos, porque eres bien loca y chévere. Tú sabes que cuando se junta la banda siempre hay desmadre del bueno, 67676767.',
      'Espero que ya vengas a Perú para que por fin podamos conocernos en persona y salir a comer con toda la banda. Pero, por favor, no me racees, porque soy marrón. JAJAJAJAJA.',
      'Cualquier cosita, tú sabes que puedes avisarme. Siempre intentaré ayudarte en lo que esté a mi alcance.',
      '¡Feliz 80 años, abuela Cheetos! Que cumplas muchísimos más y que nunca te falten motivos para reírte. Un abrazoteee.',
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
    name: 'Lynkii',
    message: 'Contigo hasta los planes más simples se convierten en recuerdos. Ojalá nunca se acaben las risas ni las historias para contar.',
  },
  {
    id: 'giank',
    name: 'Giank',
    message: 'Hoy toca celebrarte a ti. Gracias por tu alegría, por tu cariño y por estar siempre. ¡Feliz cumpleaños!',
  },
]

// Viaje a Perú (botón "¿Cuánto falta para vernos?" al final de los recuerdos).
export const PERU_TRIP = {
  // Como todavía no se sabe qué día llega, Hetto elige la fecha en la propia pantalla (y la puede cambiar cuando quiera):
  // se guarda en su navegador. Si ya hay una fecha segura, ponla aquí y será la que se use mientras ella no elija otra.
  // Formato AAAA-MM-DDTHH:MM:SS-05:00 (el -05:00 es la hora de Perú). Déjala vacía ('') para que ella la elija.
  arrival: '',
  // Solo si pones una fecha arriba: mientras sea true se muestra "fecha estimada"; ponlo en false cuando ya sea la definitiva.
  isEstimated: true,
  // Ilustración que aparece como foto del pasaporte (ruta dentro de public/).
  photo: 'images/room/hetto-peruana.webp',
  // EJEMPLO: de dónde sale ella (aparece en la tarjeta del viaje).
  origin: 'Tu ciudad',
  destination: 'Perú',
  // EJEMPLO: mensaje personal, un párrafo por línea.
  message: [
    'Cada día que pasa es uno menos para abrazarte en persona. Ya tenemos lista a la banda, las ganas de salir a comer y un montón de historias para ponernos al día.',
    'Ven con hambre, con ganas de reírte y sin apuro: aquí hay mucho Perú esperándote. ♡',
  ],
  // Texto alternativo cuando la fecha ya pasó (en vez de números negativos).
  arrivedTitle: '¡Ya estás en Perú!',
  arrivedMessage: 'Llegó el gran día: la cuenta regresiva terminó y ahora toca abrazarse, reír y salir a comer con toda la banda. ♡',
}

export type PlanIcon = 'food' | 'mountain' | 'camera' | 'heart'

// EJEMPLO: planes para cuando se vean en Perú (sección "Lo que nos espera"). Iconos: food, mountain, camera, heart.
export const PERU_PLANS: { icon: PlanIcon; title: string; text: string }[] = [
  { icon: 'food', title: 'Salir a comer con toda la banda', text: 'Mesa grande, platos para compartir y cero dietas ese día.' },
  { icon: 'mountain', title: 'Conocer un pedacito de Perú', text: 'Montañas, historia y un montón de fotos para el recuerdo.' },
  { icon: 'camera', title: 'Fotos y videos de todo', text: 'Para tener pruebas de que sí nos vimos (y de las caras que pusimos).' },
  { icon: 'heart', title: 'Abrazos sin límite de tiempo', text: 'El primero va a ser de esos que no se sueltan.' },
]

// Pies de foto del álbum de recuerdos. Las fotos y los stickers están en public/images/ (ruta relativa a esa carpeta);
// cambia los textos, quita líneas o agrega más fotos.
// size: ancho y alto reales de la foto (así la página reserva el espacio y no "salta" al cargar).
// sticker y corner (tl o tr): el muñequito que se pega arriba, en una esquina de la foto, sin tapar el pie.
export type Memory = { src: string; size: [number, number]; caption: string; alt: string; sticker?: string; corner?: 'tl' | 'tr' }

export const MEMORIES: Memory[] = [
  { src: 'memories/recuerdo-5.jpeg', size: [1448, 1086], caption: 'BTS y sus dos mayores fans', alt: 'Hetto y su esposo en un concierto lleno de luces moradas', sticker: 'personaje/rj.png', corner: 'tr' },
  { src: 'memories/recuerdo-2.jpeg', size: [1200, 1600], caption: 'Calabacita robándose todos los dulces', alt: 'Su bebé disfrazada de calabaza entre dulces de Halloween', sticker: 'room/hello-kitty.webp', corner: 'tr' },
  { src: 'memories/recuerdo-1.jpeg', size: [1448, 1086], caption: 'Ella manda la selfie, él solo sobrevive', alt: 'Hetto y su esposo en el carro', sticker: 'room/pompompurin.webp', corner: 'tl' },
  { src: 'hallowen.jpeg', size: [1600, 962], caption: 'Sexy Jessie y su adorable Meowth', alt: 'Hetto disfrazada del Equipo Rocket con su bebé vestida de Meowth', sticker: 'personaje/hello kitty.gif', corner: 'tl' },
  { src: 'memories/recuerdo-4.jpeg', size: [1280, 803], caption: 'Mario y Luigi elegantes', alt: 'Hetto y su esposo con filtros de gorras de Mario y Luigi', sticker: 'personaje/Mv-cinnamon.webp', corner: 'tl' },
  { src: 'pum-y-chettos.jpg', size: [960, 960], caption: 'Pum dándole un beso a la cumpleañera (sin permiso)', alt: 'Ilustración anime de Pum dándole un beso a Hetto, con globos, regalos y pastel', sticker: 'room/pompompurin.webp', corner: 'tr' },
  { src: 'fotolynkii con hetto.jpeg', size: [1360, 1157], caption: 'Lynkii invadiendo la foto, con pastel y todo', alt: 'Su amigo Lynkii con un pastel, junto a Hetto dibujada en estilo anime', sticker: 'personaje/List-kuromi.webp', corner: 'tr' },
  { src: 'memories/recuerdo-6.jpeg', size: [942, 1280], caption: 'Modo foto seria: nivel profesional', alt: 'Retrato de Hetto con una estrella en el mentón', sticker: 'personaje/mymelody.webp', corner: 'tr' },
  { src: 'memebebe.jpeg', size: [1200, 1600], caption: 'La jefa de la casa cobrando impuestos', alt: 'Meme de su bebé señalando a la cámara', sticker: 'room/cinnamoroll.webp', corner: 'tr' },
  { src: 'room/hettocumple.webp', size: [460, 518], caption: 'Hetto ya anda lista para su cumple', alt: 'Ilustración de Hetto con un pastel y confeti', sticker: 'room/pachacco.webp', corner: 'tl' },
  { src: 'memories/recuerdo-3.jpeg', size: [1280, 760], caption: 'Cuando la cámara se acerca demasiado', alt: 'Hetto mirando a la cámara desde abajo', sticker: 'personaje/army.png', corner: 'tl' },
]