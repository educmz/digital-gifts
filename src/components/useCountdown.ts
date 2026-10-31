import { useEffect, useState } from 'react'

export type Remaining = { done: boolean; days: number; hours: number; minutes: number; seconds: number }

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

// Tiempo que falta hasta la fecha objetivo. Si ya pasó (o la fecha no es válida) devuelve done: true, nunca números negativos.
export function getRemaining(target: number, now: number): Remaining {
  const totalSeconds = Math.floor((target - now) / 1000)
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    done: false,
    days: Math.floor(totalSeconds / DAY),
    hours: Math.floor((totalSeconds % DAY) / HOUR),
    minutes: Math.floor((totalSeconds % HOUR) / MINUTE),
    seconds: totalSeconds % MINUTE,
  }
}

// Cuenta regresiva en tiempo real: se recalcula cada segundo a partir de la fecha objetivo (cualquier formato que entienda Date).
function useCountdown(arrival: string | number | Date): Remaining {
  const target = new Date(arrival).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return getRemaining(target, now)
}

export default useCountdown
