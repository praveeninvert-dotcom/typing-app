'use client'
import { useRef, useCallback } from 'react'

interface UseKeystrokeSoundOptions {
  soundEnabled?: boolean
}

interface UseKeystrokeSoundReturn {
  playCorrect: () => void
  playIncorrect: () => void
}

export function useKeystrokeSound(
  { soundEnabled = true }: UseKeystrokeSoundOptions = {}
): UseKeystrokeSoundReturn {
  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }

  const playTone = useCallback(
    (type: OscillatorType, frequency: number, duration: number, gain: number) => {
      if (!soundEnabled) return
      const ctx = getCtx()
      if (ctx.state === 'suspended') ctx.resume()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)
      gainNode.gain.setValueAtTime(gain, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    },
    [soundEnabled] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const playCorrect = useCallback(() => playTone('square', 800, 0.06, 0.15), [playTone])
  const playIncorrect = useCallback(() => playTone('sawtooth', 200, 0.1, 0.2), [playTone])

  return { playCorrect, playIncorrect }
}
