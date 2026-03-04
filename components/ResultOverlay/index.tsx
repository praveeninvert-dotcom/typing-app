'use client'
import { useEffect } from 'react'
import type { ResultState } from '@/types'
import styles from './ResultOverlay.module.css'

interface ResultOverlayProps {
  result: ResultState
  onRetry: () => void
  onHome: () => void
}

export function ResultOverlay({ result, onRetry, onHome }: ResultOverlayProps) {
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
          <span className={styles.wpmValue}>{result.wpm}</span>
          <span className={`${styles.statLabel} ${styles.statLabelAmber}`}>WPM</span>
        </div>

        <div className={styles.statGroup}>
          <span className={styles.accuracyValue}>{result.accuracy}%</span>
          <span className={`${styles.statLabel} ${styles.statLabelBlue}`}>ACCURACY</span>
        </div>

        <div className={styles.breakdown}>
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
