import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (notify: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}

// true si el sistema pide menos movimiento (y se actualiza si la persona lo cambia con la página abierta).
function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}

export default useReducedMotion
