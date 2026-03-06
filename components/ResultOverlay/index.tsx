'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import type { ResultState } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './ResultOverlay.module.css'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 280, damping: 22 },
  },
}

const modalReducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

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
  const reducedMotion = useReducedMotion()
  const retryButtonRef = useRef<HTMLButtonElement>(null)
  const homeButtonRef = useRef<HTMLButtonElement>(null)
  const [announced, setAnnounced] = useState(false)

  const displayWpm = useCountUp(result.wpm, 800, 0)
  const displayAccuracy = useCountUp(result.accuracy, 600, 100)

  // Character breakdown visible after accuracy finishes: 600ms delay + 100ms start + 200ms fade = 900ms total
  const [breakdownVisible, setBreakdownVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setBreakdownVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  // R-074: Auto-focus RETRY button on mount
  useEffect(() => {
    retryButtonRef.current?.focus()
  }, [])

  // R-077: Announce "Test complete" to screen readers on mount
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(true), 100)
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

  // R-074: Focus trap — Tab cycles only between RETRY and HOME
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (document.activeElement === retryButtonRef.current) {
        homeButtonRef.current?.focus()
      } else {
        retryButtonRef.current?.focus()
      }
    }
  }

  return (
    <motion.div
      className={styles.backdrop}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.15 }}
    >
      {/* R-077: Visually-hidden live region announces "Test complete" on mount */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {announced ? 'Test complete' : ''}
      </div>

      <motion.div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-header"
        variants={reducedMotion ? modalReducedVariants : modalVariants}
        initial="hidden"
        animate="visible"
        onKeyDown={handleModalKeyDown}
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
            ref={retryButtonRef}
            className={styles.button}
            onClick={onRetry}
            type="button"
          >
            RETRY
          </button>
          <button
            ref={homeButtonRef}
            className={styles.button}
            onClick={onHome}
            type="button"
          >
            HOME
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
