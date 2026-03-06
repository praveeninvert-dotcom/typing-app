'use client'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Difficulty } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './DifficultySelector.module.css'

const optionVariants = {
  unselected: { scale: 1 },
  selected: { scale: [1, 1.04, 1], transition: { duration: 0.2, times: [0, 0.5, 1] } },
}

interface DifficultySelectorProps {
  selected: Difficulty | null
  onChange: (difficulty: Difficulty) => void
  disabled?: boolean
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy' as const, label: 'EASY', descriptor: '200 common words' },
  { value: 'medium' as const, label: 'MEDIUM', descriptor: '500 words + punctuation' },
  { value: 'hard' as const, label: 'HARD', descriptor: '1000 words + numbers + symbols' },
]

export function DifficultySelector({ selected, onChange, disabled }: DifficultySelectorProps) {
  const reducedMotion = useReducedMotion()
  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = DIFFICULTY_OPTIONS.findIndex(d => d.value === selected)
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (currentIndex + 1) % DIFFICULTY_OPTIONS.length
      onChange(DIFFICULTY_OPTIONS[next].value)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (currentIndex - 1 + DIFFICULTY_OPTIONS.length) % DIFFICULTY_OPTIONS.length
      onChange(DIFFICULTY_OPTIONS[prev].value)
    }
  }, [selected, onChange])

  return (
    <div
      role="radiogroup"
      aria-label="Select difficulty"
      className={styles.group}
      onKeyDown={handleContainerKeyDown}
    >
      {DIFFICULTY_OPTIONS.map((diff, index) => (
        <motion.div
          key={diff.value}
          role="radio"
          aria-checked={selected === diff.value}
          aria-label={diff.label}
          tabIndex={selected === diff.value || (selected === null && index === 0) ? 0 : -1}
          className={`${styles.option} ${selected === diff.value ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
          onClick={() => !disabled && onChange(diff.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!disabled) onChange(diff.value)
            }
          }}
          variants={optionVariants}
          animate={reducedMotion ? 'unselected' : (selected === diff.value ? 'selected' : 'unselected')}
        >
          <span className={styles.label}>{diff.label}</span>
          <span className={styles.descriptor}>{diff.descriptor}</span>
        </motion.div>
      ))}
    </div>
  )
}
