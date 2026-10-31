import { gsap } from 'gsap'
import { SONGS } from './content'

// Música de fondo de toda la página. Es un solo reproductor para toda la app (no depende de ninguna pantalla):
// empieza con el primer toque de la persona (los navegadores no dejan sonar solos), pasa de una canción a la siguiente,
// sube y baja el volumen con suavidad y recuerda si la dejaron en pausa.

const PREF_KEY = 'digital-gifts:music'
const VOLUME = 0.38
const urlOf = (file: string) => import.meta.env.BASE_URL + 'Audio/' + encodeURIComponent(file)

export type MusicState = { playing: boolean; index: number; available: boolean }

let state: MusicState = { playing: false, index: 0, available: SONGS.length > 0 }
const listeners = new Set<() => void>()
const emit = (patch: Partial<MusicState>) => {
  state = { ...state, ...patch }
  listeners.forEach(listener => listener())
}

const readWanted = () => {
  try { return window.localStorage.getItem(PREF_KEY) !== 'off' } catch { return true }
}
const saveWanted = (wanted: boolean) => {
  try {
    if (wanted) window.localStorage.removeItem(PREF_KEY)
    else window.localStorage.setItem(PREF_KEY, 'off')
  } catch { /* sin almacenamiento: no pasa nada */ }
}

let audio: HTMLAudioElement | null = null
let wanted = readWanted()   // false si la última vez la pusieron en pausa
let started = false         // ya hubo un toque de la persona
let ducked = false          // silenciada temporalmente (por ejemplo, mientras el micrófono escucha el soplido)
let pausedByTab = false     // pausada solo porque la pestaña quedó oculta
let failures = 0

const fadeTo = (volume: number, seconds: number, done?: () => void) => {
  if (!audio) return
  gsap.to(audio, { volume, duration: seconds, ease: 'none', overwrite: true, onComplete: done })
}

function load(index: number) {
  if (audio) { gsap.killTweensOf(audio); audio.pause() }
  const element = new Audio(urlOf(SONGS[index].file))
  element.preload = 'auto'
  element.volume = 0
  element.addEventListener('ended', () => next())
  element.addEventListener('error', () => {
    failures += 1
    if (failures >= SONGS.length) { emit({ playing: false, available: false }); return }
    next()
  })
  audio = element
  emit({ index })
}

async function play() {
  if (!audio) load(state.index)
  const element = audio
  if (!element) return
  try {
    await element.play()
    if (element !== audio) return   // mientras tanto se cambió de canción
    failures = 0
    emit({ playing: true })
    fadeTo(ducked ? 0 : VOLUME, 1.6)
  } catch {
    if (element === audio) emit({ playing: false })
  }
}

function pause() {
  if (!audio) return
  const element = audio
  emit({ playing: false })
  fadeTo(0, 0.5, () => { if (element === audio) element.pause() })
}

function next() {
  const shouldPlay = state.playing || (wanted && started)
  load((state.index + 1) % SONGS.length)
  if (shouldPlay) void play()
}

export const music = {
  // Se llama en el primer toque de la persona: si no la había dejado en pausa, empieza a sonar.
  start() {
    if (started || !state.available) return
    started = true
    if (wanted) void play()
  },
  toggle() {
    if (!state.available) return
    started = true
    if (state.playing) { wanted = false; saveWanted(false); pause() }
    else { wanted = true; saveWanted(true); void play() }
  },
  next,
  // Baja el volumen a cero (true) o lo devuelve (false) sin cambiar si estaba sonando o no.
  duck(on: boolean) {
    ducked = on
    if (audio && state.playing) fadeTo(on ? 0 : VOLUME, 0.6)
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  getSnapshot: () => state,
}

// Si la pestaña queda oculta, la música se pausa y vuelve sola al regresar.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.playing) {
      pausedByTab = true
      audio?.pause()
      emit({ playing: false })
    } else if (!document.hidden && pausedByTab) {
      pausedByTab = false
      void play()
    }
  })
}
