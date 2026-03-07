'use client'
import { motion } from 'framer-motion'
import styles from './StatsBar.module.css'

interface StatsBarProps {
  wpm: number
  timeLeft: number
  accuracy: number | null  // null until first char typed; displays '—'
  started: boolean         // drives Framer Motion animate
  timeWarning: boolean     // true when timeLeft <= 10 and test started
}

export function StatsBar({ wpm, timeLeft, accuracy, started, timeWarning }: StatsBarProps) {
  return (
    <motion.div
      className={styles.bar}
      data-testid="stats-bar"
      initial={{ opacity: 0 }}
      animate={started ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-hidden={!started}
      style={{ pointerEvents: started ? 'auto' : 'none' }}
    >
      <div className={styles.col}>
        <span className={styles.label}>WPM</span>
        <span
          className={`${styles.value} ${styles.valueAmber}`}
          data-testid="stat-wpm"
        >
          {wpm}
        </span>
      </div>

      <div className={`${styles.col} ${styles.colMiddle}`}>
        <span className={styles.label}>TIME</span>
        <span
          className={`${styles.value} ${timeWarning ? styles.valueRed : styles.valueBlue} ${timeWarning ? styles.timePulse : ''}`}
          data-testid="stat-time"
        >
          {timeLeft}
        </span>
      </div>

      <div className={styles.col}>
        <span className={styles.label}>ACC</span>
        <span
          className={`${styles.value} ${styles.valueWhite}`}
          data-testid="stat-acc"
        >
          {accuracy !== null ? `${accuracy}%` : '—'}
        </span>
      </div>
    </motion.div>
  )
}
