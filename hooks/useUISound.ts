'use client'
import { useRef, useCallback } from 'react'

export function useUISound() {
  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  function makeTone(
    ctx: AudioContext,
    type: OscillatorType,
    freq: number,
    startTime: number,
    duration: number,
    gain: number
  ) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, startTime)
    g.gain.setValueAtTime(gain, startTime)
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.onended = () => { osc.disconnect(); g.disconnect() }
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  const playSelect = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime
    makeTone(ctx, 'square', 500, now, 0.025, 0.08)
    makeTone(ctx, 'square', 700, now + 0.03, 0.025, 0.08)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playStart = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.linearRampToValueAtTime(1000, now + 0.1)
    g.gain.setValueAtTime(0.12, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.onended = () => { osc.disconnect(); g.disconnect() }
    osc.start(now)
    osc.stop(now + 0.1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playEscape = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.linearRampToValueAtTime(180, now + 0.12)
    g.gain.setValueAtTime(0.08, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.onended = () => { osc.disconnect(); g.disconnect() }
    osc.start(now)
    osc.stop(now + 0.12)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playConfirmQuit = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime
    makeTone(ctx, 'square', 350, now, 0.05, 0.08)
    makeTone(ctx, 'square', 150, now + 0.11, 0.05, 0.08)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playCancelQuit = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime
    makeTone(ctx, 'square', 400, now, 0.025, 0.08)
    makeTone(ctx, 'square', 550, now + 0.03, 0.025, 0.08)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { playSelect, playStart, playEscape, playConfirmQuit, playCancelQuit }
}
