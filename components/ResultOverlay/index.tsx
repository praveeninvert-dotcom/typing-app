'use client'
import { useEffect, useState, useRef } from 'react'
import type { ResultState } from '@/types'
import styles from './ResultOverlay.module.css'

/**
 * Stepped count-up from 0 to `target` over `duration` ms.
 * User decision (02-CONTEXT.md): ~8-12 visible steps, fast start slow finish (deceleration).
 * Must land exactly on `target`. Delay (ms) before starting.
 */
function useCountUp(target: number, duration: number, delay: number = 0): number {
  const [value, setValue] = useState(0)
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    setValue(0)
    if (target === 0) return

    const STEPS = 10 // 8-12 visible steps per user decision
    // Deceleration: easeOut — each step covers less distance than previous.
    // Generate step times using easeOut curve: t = duration * (i/STEPS)^0.5
    // This gives more steps early (fast) and fewer late (slow).
    const stepTimes: number[] = []
    for (let i = 1; i <= STEPS; i++) {
      stepTimes.push(delay + Math.round(duration * Math.pow(i / STEPS, 1.8)))
    }

    const timeouts: ReturnType<typeof setTimeout>[] = []
    stepTimes.forEach((t, i) => {
      const stepValue = i === STEPS - 1
        ? targetRef.current  // Final step must land exactly on target
        : Math.round(targetRef.current * Math.pow((i + 1) / STEPS, 0.55)) // Accelerated value mapping
      timeouts.push(setTimeout(() => setValue(stepValue), t))
    })

    return () => timeouts.forEach(clearTimeout)
  }, [target, duration, delay])

  return value
}

interface ResultOverlayProps {
  result: ResultState
  onRetry: () => void
  onHome: () => void
}

export function ResultOverlay({ result, onRetry, onHome }: ResultOverlayProps) {
  const displayWpm = useCountUp(result.wpm, 800, 0)
  const displayAccuracy = useCountUp(result.accuracy, 600, 100)

  // Character breakdown visible after accuracy finishes: 600ms delay + 100ms start + 200ms fade = 900ms total
  const [breakdownVisible, setBreakdownVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setBreakdownVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onRetry()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onRetry])

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-header"
      >
        <h1 id="result-header" className={styles.header}>TEST COMPLETE</h1>

        <div className={styles.statGroup}>
          <span className={styles.wpmValue}>{displayWpm}</span>
          <span className={`${styles.statLabel} ${styles.statLabelAmber}`}>WPM</span>
        </div>

        <div className={styles.statGroup}>
          <span className={styles.accuracyValue}>{displayAccuracy}%</span>
          <span className={`${styles.statLabel} ${styles.statLabelBlue}`}>ACCURACY</span>
        </div>

        <div className={`${styles.breakdown} ${breakdownVisible ? styles.breakdownVisible : ''}`}>
          <span className={styles.correct}>{result.correctChars} correct</span>
          <span className={styles.separator}>{' \u00b7 '}</span>
          <span className={styles.incorrect}>{result.incorrectChars} incorrect</span>
        </div>

        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={onRetry}
            type="button"
          >
            RETRY
          </button>
          <button
            className={styles.button}
            onClick={onHome}
            type="button"
          >
            HOME
          </button>
        </div>
      </div>
    </div>
  )
}
