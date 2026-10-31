import { useSyncExternalStore } from 'react'

// true mientras se cumpla la media query (y se actualiza si cambia el tamaño de la ventana).
function useMediaQuery(query: string) {
  const subscribe = (notify: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener('change', notify)
    return () => media.removeEventListener('change', notify)
  }
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

export default useMediaQuery