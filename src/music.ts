import { gsap } from 'gsap'
import { SONGS } from './content'

// Música de fondo de toda la página, sin ningún control a la vista: solo se reproduce.
// Empieza con el primer toque de la persona (los navegadores no dejan que suene sola), pasa de una canción a la siguiente en bucle
// y sube y baja el volumen con suavidad.

const VOLUME = 0.38
const urlOf = (file: string) => import.meta.env.BASE_URL + 'Audio/' + encodeURIComponent(file)

let audio: HTMLAudioElement | null = null
let index = 0
let playing = false
let started = false     // ya hubo un toque de la persona
let ducked = false      // silenciada temporalmente (mientras el micrófono escucha el soplido)
let pausedByTab = false // pausada solo porque la pestaña quedó oculta
let failures = 0

const fadeTo = (volume: number, seconds: number) => {
  if (audio) gsap.to(audio, { volume, duration: seconds, ease: 'none', overwrite: true })
}

function load(next: number) {
  if (audio) { gsap.killTweensOf(audio); audio.pause() }
  index = next
  const element = new Audio(urlOf(SONGS[index].file))
  element.preload = 'auto'
  element.volume = 0
  element.addEventListener('ended', () => skip())
  element.addEventListener('error', () => {
    failures += 1
    if (failures < SONGS.length) skip()   // si un archivo falla, pasa al siguiente (y se rinde si fallan todos)
  })
  audio = element
}

async function play() {
  if (!audio) load(index)
  const element = audio
  if (!element) return
  try {
    await element.play()
    if (element !== audio) return   // mientras tanto se cambió de canción
    failures = 0
    playing = true
    fadeTo(ducked ? 0 : VOLUME, 1.6)
  } catch {
    if (element === audio) playing = false
  }
}

function skip() {
  load((index + 1) % SONGS.length)
  void play()
}

export const music = {
  // Se llama en el primer toque de la persona.
  start() {
    if (started || SONGS.length === 0) return
    started = true
    void play()
  },
  // Baja el volumen a cero (true) o lo devuelve (false): se usa mientras el micrófono escucha el soplido de la vela.
  duck(on: boolean) {
    ducked = on
    if (audio && playing) fadeTo(on ? 0 : VOLUME, 0.6)
  },
}

// Si la pestaña queda oculta, la música se pausa y vuelve sola al regresar.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) {
      pausedByTab = true
      audio?.pause()
      playing = false
    } else if (!document.hidden && pausedByTab) {
      pausedByTab = false
      void play()
    }
  })
}
