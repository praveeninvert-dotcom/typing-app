'use client'
import { useState } from 'react'
import type { Difficulty } from '@/types'
import { DifficultySelector } from '@/components/DifficultySelector'
import styles from './HomeScreen.module.css'

interface HomeScreenProps {
  onStart: (difficulty: Difficulty) => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)

  const handleStart = () => {
    if (selectedDifficulty !== null) {
      onStart(selectedDifficulty)
    }
  }

  return (
    <main className={styles.screen}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>TYPING.EXE</h1>
        <span className={styles.cursor} aria-hidden="true">{'█'}</span>
      </div>

      <p className={styles.subtitle}>SELECT DIFFICULTY</p>

      <DifficultySelector
        selected={selectedDifficulty}
        onChange={setSelectedDifficulty}
      />

      <button
        className={styles.startButton}
        disabled={selectedDifficulty === null}
        onClick={handleStart}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && selectedDifficulty !== null) {
            e.preventDefault()
            onStart(selectedDifficulty)
          }
        }}
        type="button"
        aria-label="Start typing test"
      >
        {'[ START ]'}
      </button>
    </main>
  )
}
