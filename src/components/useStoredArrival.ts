import { useState } from 'react'

const KEY = 'digital-gifts:peru-arrival'

// La fecha de llegada que elige Hetto en la pantalla de Perú. Se guarda en este navegador (localStorage), así que al volver a abrir
// la página sigue ahí. Si el navegador no deja guardar (modo privado, etc.), la elección dura mientras la página esté abierta.
function useStoredArrival(): [string, (value: string) => void] {
  const [value, setValue] = useState(() => {
    try { return window.localStorage.getItem(KEY) ?? '' } catch { return '' }
  })
  const save = (next: string) => {
    setValue(next)
    try {
      if (next) window.localStorage.setItem(KEY, next)
      else window.localStorage.removeItem(KEY)
    } catch { /* sin almacenamiento: no pasa nada */ }
  }
  return [value, save]
}

export default useStoredArrival