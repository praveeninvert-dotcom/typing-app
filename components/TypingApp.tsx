'use client'
import { useState } from 'react'
import type { Screen, Difficulty, ResultState } from '@/types'
import { HomeScreen } from '@/components/HomeScreen'
import { TestScreen } from '@/components/TestScreen'
import { ResultOverlay } from '@/components/ResultOverlay'

export function TypingApp() {
  const [screen, setScreen] = useState<Screen>('home')
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [result, setResult] = useState<ResultState | null>(null)

  const handleStart = (d: Difficulty) => {
    setDifficulty(d)
    setScreen('test')
  }

  const handleTestFinish = (r: ResultState) => {
    setResult(r)
    setScreen('result')
  }

  const handleRetry = () => {
    // Keep same difficulty; TestScreen regenerates words on mount via lazy useState initializer
    setScreen('test')
  }

  const handleHome = () => {
    setScreen('home')
    setDifficulty(null)
    setResult(null)
  }

  if (screen === 'home') {
    return <HomeScreen onStart={handleStart} />
  }

  if (screen === 'test' && difficulty !== null) {
    return <TestScreen difficulty={difficulty} onFinish={handleTestFinish} />
  }

  if (screen === 'result' && result !== null) {
    return <ResultOverlay result={result} onRetry={handleRetry} onHome={handleHome} />
  }

  // Fallback — should never reach here if transitions are correct
  return <HomeScreen onStart={handleStart} />
}
