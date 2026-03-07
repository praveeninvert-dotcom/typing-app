'use client'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Difficulty } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './DifficultySelector.module.css'

interface DifficultySelectorProps {
  value: Difficulty | null
  onChange: (difficulty: Difficulty) => void
  disabled?: boolean
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy' as const, label: 'EASY', descriptor: '200 common words', testId: 'difficulty-easy' },
  { value: 'medium' as const, label: 'MEDIUM', descriptor: '500 mixed words', testId: 'difficulty-medium' },
  { value: 'hard' as const, label: 'HARD', descriptor: '1000+ rare words', testId: 'difficulty-hard' },
]

export function DifficultySelector({ value, onChange, disabled }: DifficultySelectorProps) {
  const reducedMotion = useReducedMotion()

  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = DIFFICULTY_OPTIONS.findIndex(d => d.value === value)
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (currentIndex + 1) % DIFFICULTY_OPTIONS.length
      onChange(DIFFICULTY_OPTIONS[next].value)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (currentIndex - 1 + DIFFICULTY_OPTIONS.length) % DIFFICULTY_OPTIONS.length
      onChange(DIFFICULTY_OPTIONS[prev].value)
    }
  }, [value, onChange])

  return (
    <div
      role="radiogroup"
      aria-label="Select difficulty"
      className={styles.container}
      data-testid="difficulty-selector"
      onKeyDown={handleContainerKeyDown}
    >
      {DIFFICULTY_OPTIONS.map((diff, index) => (
        <motion.button
          key={diff.value}
          role="radio"
          aria-checked={value === diff.value}
          aria-label={diff.label}
          tabIndex={value === diff.value || (value === null && index === 0) ? 0 : -1}
          data-testid={diff.testId}
          className={`${styles.card} ${value === diff.value ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
          onClick={() => !disabled && onChange(diff.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!disabled) onChange(diff.value)
            }
          }}
          type="button"
          whileHover={reducedMotion ? {} : { scale: 1.03 }}
          whileTap={reducedMotion ? {} : { scale: 0.97 }}
          animate={reducedMotion ? {} : (value === diff.value ? { scale: [1, 1.05, 1] } : { scale: 1 })}
          transition={
            value === diff.value
              ? { type: 'tween', duration: 0.3, times: [0, 0.5, 1], ease: 'easeInOut' }
              : { duration: 0.15 }
          }
        >
          <span className={styles.label}>{diff.label}</span>
          <span className={styles.descriptor}>{diff.descriptor}</span>
        </motion.button>
      ))}
    </div>
  )
}
