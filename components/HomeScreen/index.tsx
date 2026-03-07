'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Difficulty } from '@/types'
import { DifficultySelector } from '@/components/DifficultySelector'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './HomeScreen.module.css'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
}

interface HomeScreenProps {
  onStart: (difficulty: Difficulty) => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const reducedMotion = useReducedMotion()

  const handleStart = () => {
    if (selectedDifficulty !== null) {
      onStart(selectedDifficulty)
    }
  }

  const activeContainerVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0, delayChildren: 0 } } }
    : containerVariants

  const activeItemVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : itemVariants

  return (
    <motion.main
      className={styles.screen}
      data-testid="home-screen"
      variants={activeContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={activeItemVariants}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>TYPING.EXE</h1>
          <span className={styles.cursor} aria-hidden="true">{'█'}</span>
        </div>
      </motion.div>

      <motion.div variants={activeItemVariants}>
        <p className={styles.subtitle}>SELECT DIFFICULTY</p>
      </motion.div>

      <motion.div variants={activeItemVariants}>
        <DifficultySelector
          value={selectedDifficulty}
          onChange={setSelectedDifficulty}
        />
      </motion.div>

      <motion.div variants={activeItemVariants}>
        <button
          className={styles.startButton}
          data-testid="start-button"
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
      </motion.div>
    </motion.main>
  )
}
