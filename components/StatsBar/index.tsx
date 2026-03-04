'use client'
import styles from './StatsBar.module.css'

interface StatsBarProps {
  wpm: number
  timeLeft: number
  accuracy: number | null  // null until first char typed; displays '—'
  started: boolean         // controls opacity: 0 vs opacity: 1
}

export function StatsBar({ wpm, timeLeft, accuracy, started }: StatsBarProps) {
  return (
    <div
      className={styles.bar}
      style={{ opacity: started ? 1 : 0, pointerEvents: started ? 'auto' : 'none' }}
      aria-hidden={!started}
    >
      <div className={styles.slot}>
        <span className={`${styles.label} ${styles.labelAmber}`}>WPM</span>
        <span className={`${styles.value} ${styles.valueAmber}`}>{wpm}</span>
      </div>
      <div className={styles.slot}>
        <span className={`${styles.label} ${styles.labelBlue}`}>TIME</span>
        <span className={`${styles.value} ${styles.valueBlue}`}>{timeLeft}</span>
      </div>
      <div className={styles.slot}>
        <span className={`${styles.label} ${styles.labelDim}`}>ACC</span>
        <span className={`${styles.value} ${styles.valueWhite}`}>
          {accuracy !== null ? `${accuracy}%` : '—'}
        </span>
      </div>
    </div>
  )
}
