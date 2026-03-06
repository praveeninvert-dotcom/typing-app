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

  const [soundEnabled, setSoundEnabled] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const { playCorrect, playIncorrect } = useKeystrokeSound({ soundEnabled })

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
      const key = e.key
      // Determine correct/incorrect BEFORE engine processes key — no sound for Space or Backspace
      if (key.length === 1 && key !== ' ') {
        const currentWord = engine.words[engine.currentWordIndex]
        if (currentWord && engine.currentCharIndex < currentWord.chars.length) {
          const expectedChar = currentWord.chars[engine.currentCharIndex].expected
          if (key === expectedChar) {
            playCorrect()
          } else {
            playIncorrect()
          }
        }
      }
      engine.handleKey(key)
    },
    [engine, playCorrect, playIncorrect]
  )

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // Live stats for StatsBar
  const elapsedSeconds = TIMER_DURATION - countdown.timeLeft
  const wpm =
    elapsedSeconds >= 5
      ? Math.round((engine.correctChars / 5) / (elapsedSeconds / 60))
      : 0
  const accuracy =
    engine.totalTypedChars > 0
      ? Math.round((engine.correctChars / engine.totalTypedChars) * 100)
      : null
  const timeWarning = engine.started && countdown.timeLeft <= 10 && countdown.timeLeft > 0

  return (
    <main className={styles.screen} onClick={handleContainerClick}>
      {/* Visually-hidden heading for screen readers — landmark + page-has-heading-one requirement */}
      <h1 className={styles.srOnly}>Typing Test — Active</h1>

      {/* Sound toggle — top-right, absolute positioned */}
      <button
        className={styles.sndToggle}
        onClick={(e) => {
          e.stopPropagation()
          setSoundEnabled(v => !v)
        }}
        type="button"
        aria-label={soundEnabled ? 'Sound on, click to mute' : 'Sound off, click to unmute'}
        aria-pressed={soundEnabled}
      >
        {soundEnabled ? '[ SND: ON ]' : '[ SND: OFF ]'}
      </button>

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
        timeWarning={timeWarning}
      />

      <div className={styles.textDisplayContainer}>
        <TextDisplay
          words={engine.words}
          currentWordIndex={engine.currentWordIndex}
          currentCharIndex={engine.currentCharIndex}
        />
      </div>

      <p className={styles.escapeHint}>{'[ ESC ] QUIT'}</p>
    </main>
  )
}
