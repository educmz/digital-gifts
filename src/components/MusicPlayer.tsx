import { useSyncExternalStore } from 'react'
import { SONGS } from '../content'
import { music } from '../music'

// Control pequeño de la música: pausar / seguir y pasar a la siguiente canción. Va fijo abajo a la izquierda.
function MusicPlayer({ visible }: { visible: boolean }) {
  const state = useSyncExternalStore(music.subscribe, music.getSnapshot, music.getSnapshot)
  if (!visible || !state.available) return null
  const song = SONGS[state.index]

  return (
    <div className={`music ${state.playing ? 'is-playing' : ''}`} role="group" aria-label="Música de fondo">
      <button type="button" className="music-toggle" onClick={music.toggle} data-no-hearts
        aria-label={state.playing ? 'Pausar la música' : 'Poner la música'} aria-pressed={state.playing}>
        {state.playing ? (
          <span className="music-bars" aria-hidden="true"><i /><i /><i /><i /></span>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
        )}
      </button>
      <span className="music-title" aria-live="polite"><b>{song.title}</b><small>{song.artist}</small></span>
      <button type="button" className="music-next" onClick={music.next} data-no-hearts aria-label="Siguiente canción">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6.5v11l8-5.5zM16 6h2.5v12H16z" fill="currentColor" /></svg>
      </button>
    </div>
  )
}

export default MusicPlayer
