import { useEffect, useRef } from 'react'

// Detecta un soplido al micrófono: un ruido fuerte y sostenido unos instantes.
// Solo pide permiso cuando `active` pasa a verdadero (después de que la persona lo pide).
export function useBlowDetection(active: boolean, onBlow: () => void, onError: () => void) {
  const blowRef = useRef(onBlow)
  const errorRef = useRef(onError)
  useEffect(() => {
    blowRef.current = onBlow
    errorRef.current = onError
  })

  useEffect(() => {
    if (!active) return
    let cancelled = false
    let frame = 0
    let stream: MediaStream | undefined
    let context: AudioContext | undefined

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        })
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop())
          return
        }
        context = new AudioContext()
        const analyser = context.createAnalyser()
        analyser.fftSize = 512
        context.createMediaStreamSource(stream).connect(analyser)
        const samples = new Uint8Array(analyser.fftSize)
        let loudSince = 0
        const tick = (time: number) => {
          analyser.getByteTimeDomainData(samples)
          let sum = 0
          for (const sample of samples) {
            const normalized = (sample - 128) / 128
            sum += normalized * normalized
          }
          const level = Math.sqrt(sum / samples.length)
          if (level > 0.18) {
            if (!loudSince) loudSince = time
            else if (time - loudSince > 350) { blowRef.current(); return }
          } else {
            loudSince = 0
          }
          frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      } catch {
        if (!cancelled) errorRef.current()
      }
    }
    void start()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      stream?.getTracks().forEach(track => track.stop())
      void context?.close()
    }
  }, [active])
}
