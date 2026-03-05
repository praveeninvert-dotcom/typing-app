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
      initial={{ opacity: 0, y: -8 }}
      animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-hidden={!started}
      style={{ pointerEvents: started ? 'auto' : 'none' }}
    >
      <div className={styles.slot}>
        <span className={`${styles.label} ${styles.labelAmber}`}>WPM</span>
        <span className={`${styles.value} ${styles.valueAmber}`}>{wpm}</span>
      </div>
      <div className={styles.slot}>
        <span className={`${styles.label} ${styles.labelBlue}`}>TIME</span>
        <span
          className={`${styles.value} ${timeWarning ? styles.valueRed : styles.valueBlue} ${timeWarning ? styles.timePulse : ''}`}
        >
          {timeLeft}
        </span>
      </div>
      <div className={styles.slot}>
        <span className={`${styles.label} ${styles.labelDim}`}>ACC</span>
        <span className={`${styles.value} ${styles.valueWhite}`}>
          {accuracy !== null ? `${accuracy}%` : '—'}
        </span>
      </div>
    </motion.div>
  )
}
