'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { Difficulty, ResultState } from '@/types'
import { generateText } from '@/lib/generateText'
import { TIMER_DURATION } from '@/lib/constants'
import { useTypingEngine } from '@/hooks/useTypingEngine'
import { useCountdown } from '@/hooks/useCountdown'
import { useKeystrokeSound } from '@/hooks/useKeystrokeSound'
import { StatsBar } from '@/components/StatsBar'
import { TextDisplay } from '@/components/TextDisplay'
import styles from './TestScreen.module.css'

interface TestScreenProps {
  difficulty: Difficulty
  onFinish: (result: ResultState) => void
}

export function TestScreen({ difficulty, onFinish }: TestScreenProps) {
  // Words generated once on mount via lazy initializer — stable reference
  const [words] = useState(() => generateText(difficulty))

  const inputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line no-unused-vars
  const { playCorrect: _playCorrect, playIncorrect: _playIncorrect } = useKeystrokeSound()

  // Compute result from engine state and elapsed time
  const computeResult = useCallback(
    (correctChars: number, incorrectChars: number, elapsedSeconds: number, totalTypedChars: number): ResultState => ({
      wpm: Math.round((correctChars / 5) / ((elapsedSeconds || 1) / 60)),
      accuracy:
        totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 0,
      correctChars,
      incorrectChars,
    }),
    []
  )

  const countdown = useCountdown({
    onComplete: () => {
      // Timer hit zero — compute result using ref values captured at call time
      onFinish(
        computeResult(
          engineRef.current.correctChars,
          engineRef.current.incorrectChars,
          TIMER_DURATION,
          engineRef.current.totalTypedChars
        )
      )
    },
  })

  const engine = useTypingEngine({
    words,
    onStart: () => {
      countdown.start()
    },
    onFinish: () => {
      // Word list exhausted — compute result
      const elapsed = TIMER_DURATION - countdown.timeLeft
      onFinish(
        computeResult(
          engine.correctChars,
          engine.incorrectChars,
          elapsed || 1,
          engine.totalTypedChars
        )
      )
    },
  })

  // Keep a ref to engine values for the countdown onComplete closure
  const engineRef = useRef(engine)
  useEffect(() => {
    engineRef.current = engine
  }, [engine])

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault() // Prevents Space from scrolling page, etc.
      engine.handleKey(e.key)
    },
    [engine.handleKey]
  )

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // Live stats for StatsBar
  const elapsedSeconds = TIMER_DURATION - countdown.timeLeft
  const wpm =
    elapsedSeconds > 0
      ? Math.round((engine.correctChars / 5) / (elapsedSeconds / 60))
      : 0
  const accuracy =
    engine.totalTypedChars > 0
      ? Math.round((engine.correctChars / engine.totalTypedChars) * 100)
      : null

  return (
    <div className={styles.screen} onClick={handleContainerClick}>
      {/* Hidden input captures all keystrokes — position absolute, not display:none (must be in tab order) */}
      <input
        ref={inputRef}
        autoFocus
        aria-label="Type the displayed text"
        className={styles.hiddenInput}
        onKeyDown={handleKeyDown}
        value=""
        onChange={() => {}}
        readOnly={engine.finished}
      />

      <StatsBar
        wpm={wpm}
        timeLeft={countdown.timeLeft}
        accuracy={accuracy}
        started={engine.started}
      />

      <div className={styles.textDisplayContainer}>
        <TextDisplay
          words={engine.words}
          currentWordIndex={engine.currentWordIndex}
          currentCharIndex={engine.currentCharIndex}
        />
      </div>

      <p className={styles.escapeHint}>{'[ ESC ] QUIT'}</p>
    </div>
  )
}
