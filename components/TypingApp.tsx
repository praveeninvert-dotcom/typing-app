'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Screen, Difficulty, ResultState } from '@/types'
import { HomeScreen } from '@/components/HomeScreen'
import { TestScreen } from '@/components/TestScreen'
import { ResultOverlay } from '@/components/ResultOverlay'

const screenVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const screenTransition = { duration: 0.2 }

export function TypingApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [result, setResult] = useState<ResultState | null>(null)
  const [testKey, setTestKey] = useState(0)

  const handleStart = (d: Difficulty) => {
    setDifficulty(d)
    setScreen('test')
  }

  const handleTestFinish = (r: ResultState) => {
    setResult(r)
    setScreen('result')
  }

  const handleRetry = () => {
    setTestKey(k => k + 1)  // Forces TestScreen remount -> new word list
    setScreen('test')
  }

  const handleHome = () => {
    setScreen('home')
    setDifficulty(null)
    setResult(null)
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'home' && (
        <motion.div
          key="home"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          style={{ width: '100%', height: '100%' }}
        >
          <HomeScreen onStart={handleStart} />
        </motion.div>
      )}

      {screen === 'test' && difficulty !== null && (
        <motion.div
          key="test"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          style={{ width: '100%', height: '100%' }}
        >
          <TestScreen key={testKey} difficulty={difficulty} onFinish={handleTestFinish} />
        </motion.div>
      )}

      {screen === 'result' && result !== null && (
        <motion.div
          key="result"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          style={{ width: '100%', height: '100%' }}
        >
          <ResultOverlay result={result} onRetry={handleRetry} onHome={handleHome} />
        </motion.div>
      )}

      {/* Fallback: should never reach — keep for type safety */}
      {screen !== 'home' && screen !== 'test' && screen !== 'result' && (
        <motion.div
          key="fallback"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={screenTransition}
          style={{ width: '100%', height: '100%' }}
        >
          <HomeScreen onStart={handleStart} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
