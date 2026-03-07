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
  onQuit: () => void
}

export function TestScreen({ difficulty, onFinish, onQuit }: TestScreenProps) {
  // Words generated once on mount via lazy initializer — stable reference
  const [words] = useState(() => generateText(difficulty))

  // R-050/R-051: Caps Lock detection state
  const [capsLockOn, setCapsLockOn] = useState(false)
  // R-052/R-053/R-054/R-055/R-056: Quit confirmation state
  const [quitting, setQuitting] = useState(false)
  // R-063: Wrong key shake trigger counter
  const [wrongKeyCount, setWrongKeyCount] = useState(0)
  // R-064: Correct word flash index
  const [flashWordIndex, setFlashWordIndex] = useState<number | null>(null)
  // R-068: Cursor blink pause while typing
  const [isTyping, setIsTyping] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const yesButtonRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevWordIndexRef = useRef(0)
  // Sound always on — no UI toggle
  const { playCorrect, playIncorrect } = useKeystrokeSound()

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

  // R-050/R-051: Detect Caps Lock toggled outside the hidden input (e.g. via OS shortcut)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState('CapsLock'))
    }
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('keyup', handler)
    }
  }, [])

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [])

  // R-064: Detect correct word completion for flash animation
  useEffect(() => {
    const prevIdx = prevWordIndexRef.current
    if (engine.currentWordIndex > prevIdx) {
      const prevWord = engine.words[prevIdx]
      if (prevWord && prevWord.state === 'correct') {
        setFlashWordIndex(prevIdx)
        setTimeout(() => setFlashWordIndex(null), 300)
      }
    }
    prevWordIndexRef.current = engine.currentWordIndex
  }, [engine.currentWordIndex, engine.words])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault() // Prevents Space from scrolling page, etc.

      // R-050/R-051: Update Caps Lock state on every keydown inside the input
      setCapsLockOn(e.getModifierState('CapsLock'))

      // R-052/R-053/R-055/R-056: Escape key — show/dismiss quit confirmation
      if (e.key === 'Escape') {
        if (quitting) {
          // Escape dismisses (same as NO) — R-056
          setQuitting(false)
          countdown.resume()
          inputRef.current?.focus()
        } else if (engine.started && !engine.finished) {
          setQuitting(true)
          countdown.pause()
          // Focus YES button after state update
          setTimeout(() => yesButtonRef.current?.focus(), 0)
        }
        return
      }

      // R-057: Space and Backspace before first character do not start the timer
      if (!engine.started && (e.key === ' ' || e.key === 'Backspace')) return

      const key = e.key

      // R-068: Track typing activity for cursor blink pause
      if (key.length === 1) {
        setIsTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 300)
      }

      // Determine correct/incorrect BEFORE engine processes key — no sound for Space or Backspace
      if (key.length === 1 && key !== ' ') {
        const currentWord = engine.words[engine.currentWordIndex]
        if (currentWord && engine.currentCharIndex < currentWord.chars.length) {
          const expectedChar = currentWord.chars[engine.currentCharIndex].expected
          if (key === expectedChar) {
            playCorrect()
          } else {
            playIncorrect()
            // R-063: Increment shake counter on wrong keypress
            setWrongKeyCount(c => c + 1)
          }
        }
      }

      engine.handleKey(key)
    },
    [engine, quitting, countdown, playCorrect, playIncorrect]
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
    <main className={styles.screen} data-testid="test-screen" onClick={handleContainerClick}>
      {/* Visually-hidden heading for screen readers — landmark + page-has-heading-one requirement */}
      <h1 className={styles.srOnly}>Typing Test — Active</h1>

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

      <div className={styles.container} data-testid="test-container">
        <StatsBar
          wpm={wpm}
          timeLeft={countdown.timeLeft}
          accuracy={accuracy}
          started={engine.started}
          timeWarning={timeWarning}
        />

        <div className={styles.textDisplayContainer} data-testid="text-display">
          <TextDisplay
            words={engine.words}
            currentWordIndex={engine.currentWordIndex}
            currentCharIndex={engine.currentCharIndex}
            shakeCount={wrongKeyCount}
            flashWordIndex={flashWordIndex}
            isTyping={isTyping}
          />
        </div>

        {/* R-050/R-051: Caps Lock warning — role="alert" for screen readers */}
        {capsLockOn && (
          <div
            className={styles.capsWarning}
            role="alert"
            aria-live="assertive"
          >
            {'⚠ CAPS LOCK ON'}
          </div>
        )}

        <p className={styles.escapeHint}>{'[ ESC ] QUIT'}</p>
      </div>

      {/* R-052/R-053/R-054/R-055/R-056/R-073: Quit confirmation overlay */}
      {quitting && (
        <div
          className={styles.quitOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quit-title"
          onKeyDown={(e) => {
            // R-073: Focus trap — Tab cycles between YES and NO only
            if (e.key === 'Tab') {
              e.preventDefault()
              if (document.activeElement === yesButtonRef.current) {
                noButtonRef.current?.focus()
              } else {
                yesButtonRef.current?.focus()
              }
            }
            if (e.key === 'Escape') {
              setQuitting(false)
              countdown.resume()
              inputRef.current?.focus()
            }
          }}
        >
          <div className={styles.quitModal}>
            <p id="quit-title" className={styles.quitTitle}>QUIT TEST?</p>
            <div className={styles.quitButtons}>
              <button
                ref={yesButtonRef}
                className={styles.quitButton}
                onClick={() => { setQuitting(false); onQuit() }}
                type="button"
              >
                {'[ YES ]'}
              </button>
              <button
                ref={noButtonRef}
                className={styles.quitButton}
                onClick={() => { setQuitting(false); countdown.resume(); inputRef.current?.focus() }}
                type="button"
              >
                {'[ NO ]'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
