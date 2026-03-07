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
  hidden: { opacity: 0, scale: 0.8 },
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

const statBoxVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const staggerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
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
    const stepTimes: number[] = []
    for (let i = 1; i <= STEPS; i++) {
      stepTimes.push(delay + Math.round(duration * Math.pow(i / STEPS, 1.8)))
    }

    const timeouts: ReturnType<typeof setTimeout>[] = []
    stepTimes.forEach((t, i) => {
      const stepValue = i === STEPS - 1
        ? targetRef.current
        : Math.round(targetRef.current * Math.pow((i + 1) / STEPS, 0.55))
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
  const [breakdownVisible, setBreakdownVisible] = useState(false)
  const [playAgainVisible, setPlayAgainVisible] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(false)

  const displayWpm = useCountUp(result.wpm, 800, 0)
  const displayAccuracy = useCountUp(result.accuracy, 600, 100)

  // Staggered reveal: breakdown → playAgain → buttons
  useEffect(() => {
    const t1 = setTimeout(() => setBreakdownVisible(true), 900)
    const t2 = setTimeout(() => setPlayAgainVisible(true), 1100)
    const t3 = setTimeout(() => setButtonsVisible(true), 1300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
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
      data-testid="result-backdrop"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.2 }}
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
        data-testid="result-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-header"
        variants={reducedMotion ? modalReducedVariants : modalVariants}
        initial="hidden"
        animate="visible"
        onKeyDown={handleModalKeyDown}
      >
        <h1 id="result-header" className={styles.header}>TEST COMPLETE</h1>

        {/* Stat boxes row */}
        <motion.div
          className={styles.statRow}
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.wpmBox} variants={statBoxVariants}>
            <span className={styles.wpmValue} data-testid="result-wpm">{displayWpm}</span>
            <span className={styles.boxLabel}>WPM</span>
          </motion.div>

          <motion.div className={styles.accBox} variants={statBoxVariants}>
            <span className={styles.accValue} data-testid="result-acc">{displayAccuracy}%</span>
            <span className={`${styles.boxLabel} ${styles.boxLabelBlue}`}>ACCURACY</span>
          </motion.div>
        </motion.div>

        {/* Character breakdown */}
        <div
          className={`${styles.breakdown} ${breakdownVisible ? styles.breakdownVisible : ''}`}
          data-testid="result-chars"
        >
          <span className={styles.correct}>{result.correctChars}</span>
          <span className={styles.separator}>{' correct \u00b7 '}</span>
          <span className={styles.incorrect}>{result.incorrectChars}</span>
          <span className={styles.separator}>{' wrong'}</span>
        </div>

        {/* Dashed divider */}
        <div className={styles.divider} />

        {/* "PLAY AGAIN?" prompt text */}
        <p className={`${styles.playAgain} ${playAgainVisible ? styles.playAgainVisible : ''}`}>
          PLAY AGAIN?
        </p>

        {/* Buttons */}
        <div className={`${styles.buttons} ${buttonsVisible ? styles.buttonsVisible : ''}`}>
          <button
            ref={retryButtonRef}
            className={styles.button}
            data-testid="retry-button"
            onClick={onRetry}
            type="button"
          >
            RETRY
          </button>
          <button
            ref={homeButtonRef}
            className={styles.button}
            data-testid="home-button"
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
