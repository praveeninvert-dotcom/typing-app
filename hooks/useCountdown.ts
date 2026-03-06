import { useState, useRef, useCallback } from 'react'
import { TIMER_DURATION } from '@/lib/constants'

interface UseCountdownOptions {
  onComplete: () => void
}

interface UseCountdownReturn {
  timeLeft: number
  start: () => void
  reset: () => void
  pause: () => void
  resume: () => void
}

export function useCountdown({ onComplete }: UseCountdownOptions): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Store onComplete in a ref to avoid stale closure — critical pitfall documented in RESEARCH.md
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  // Pause gate — when true, interval tick is skipped
  const pausedRef = useRef(false)

  const start = useCallback(() => {
    // Guard: if already running, do not create a second interval
    if (intervalRef.current !== null) return
    intervalRef.current = setInterval(() => {
      // R-052/R-053: Pause gate — skip tick when paused
      if (pausedRef.current) return
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          // Call via ref to avoid stale closure — never inline onComplete here
          onCompleteRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    pausedRef.current = false
    setTimeLeft(TIMER_DURATION)
  }, [])

  const pause = useCallback(() => {
    pausedRef.current = true
  }, [])

  const resume = useCallback(() => {
    pausedRef.current = false
  }, [])

  return { timeLeft, start, reset, pause, resume }
}
