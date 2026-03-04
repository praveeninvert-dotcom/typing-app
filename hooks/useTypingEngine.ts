import { useReducer, useCallback } from 'react'
import type { Word, Char } from '@/types'

// ---------------------------------------------------------------------------
// Exported utility functions (also used in tests via require)
// ---------------------------------------------------------------------------

export function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0
  return Math.round((correctChars / 5) / (elapsedSeconds / 60))
}

export function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars === 0) return 0
  return Math.round((correctChars / totalTypedChars) * 100)
}

// ---------------------------------------------------------------------------
// Hook types
// ---------------------------------------------------------------------------

export interface UseTypingEngineOptions {
  words: Word[]
  onStart: () => void
  onFinish: () => void
}

export interface UseTypingEngineReturn {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
  started: boolean
  finished: boolean
  correctChars: number
  incorrectChars: number
  totalTypedChars: number
  handleKey: (key: string) => void
}

// ---------------------------------------------------------------------------
// Reducer state and actions
// ---------------------------------------------------------------------------

interface EngineState {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
  started: boolean
  finished: boolean
  correctChars: number
  incorrectChars: number
  totalTypedChars: number
}

type EngineAction =
  | { type: 'PRINTABLE_KEY'; key: string }
  | { type: 'SPACE' }
  | { type: 'BACKSPACE' }

function engineReducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case 'PRINTABLE_KEY': {
      if (state.finished) return state

      const { words, currentWordIndex, currentCharIndex } = state
      const word = words[currentWordIndex]

      // Don't allow typing past the end of a word — user must press Space first
      if (currentCharIndex >= word.chars.length) return state

      const char = word.chars[currentCharIndex]

      const isCorrect = action.key === char.expected

      // Build updated char
      const updatedChar: Char = {
        ...char,
        typed: action.key,
        state: isCorrect ? 'correct' : 'incorrect',
      }

      // Build updated chars array for current word
      const updatedChars = [...word.chars]
      updatedChars[currentCharIndex] = updatedChar

      // Build updated words array
      const updatedWords = [...words]
      updatedWords[currentWordIndex] = { ...word, chars: updatedChars }

      const newCorrectChars = state.correctChars + (isCorrect ? 1 : 0)
      const newIncorrectChars = state.incorrectChars + (isCorrect ? 0 : 1)
      const newTotalTypedChars = state.totalTypedChars + 1
      const newCharIndex = currentCharIndex + 1

      // Check if this was the last char of the last word
      const isLastWord = currentWordIndex === words.length - 1
      const isLastChar = newCharIndex === word.chars.length
      const isComplete = isLastWord && isLastChar

      return {
        ...state,
        words: updatedWords,
        started: true,
        finished: isComplete,
        currentCharIndex: newCharIndex,
        correctChars: newCorrectChars,
        incorrectChars: newIncorrectChars,
        totalTypedChars: newTotalTypedChars,
      }
    }

    case 'SPACE': {
      // Space before started does nothing
      if (!state.started) return state
      if (state.finished) return state

      const { words, currentWordIndex } = state

      // Lock current word: 'correct' if all chars are correct, otherwise 'incorrect'
      const word = words[currentWordIndex]
      const allCorrect = word.chars.every((c) => c.state === 'correct')
      const updatedWord = { ...word, state: (allCorrect ? 'correct' : 'incorrect') as Word['state'] }

      const updatedWords = [...words]
      updatedWords[currentWordIndex] = updatedWord

      const newWordIndex = currentWordIndex + 1

      // Check if advancing past the last word finishes the test
      const isComplete = newWordIndex >= words.length

      return {
        ...state,
        words: updatedWords,
        currentWordIndex: newWordIndex,
        currentCharIndex: 0,
        finished: isComplete,
      }
    }

    case 'BACKSPACE': {
      if (state.finished) return state

      const { currentCharIndex, currentWordIndex, words } = state

      // Boundary guard — cannot backspace past start of word
      if (currentCharIndex === 0) return state

      const newCharIndex = currentCharIndex - 1
      const word = words[currentWordIndex]
      const prevChar = word.chars[newCharIndex]

      // Determine which counter to decrement
      const wasCorrect = prevChar.state === 'correct'
      const wasIncorrect = prevChar.state === 'incorrect'

      // Reset the char at newCharIndex
      const resetChar: Char = {
        ...prevChar,
        typed: null,
        state: 'untyped',
      }

      const updatedChars = [...word.chars]
      updatedChars[newCharIndex] = resetChar

      const updatedWords = [...words]
      updatedWords[currentWordIndex] = { ...word, chars: updatedChars }

      return {
        ...state,
        words: updatedWords,
        currentCharIndex: newCharIndex,
        correctChars: state.correctChars - (wasCorrect ? 1 : 0),
        incorrectChars: state.incorrectChars - (wasIncorrect ? 1 : 0),
        totalTypedChars: state.totalTypedChars - 1,
      }
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTypingEngine({
  words: initialWords,
  onStart,
  onFinish,
}: UseTypingEngineOptions): UseTypingEngineReturn {
  const [state, dispatch] = useReducer(engineReducer, {
    words: initialWords,
    currentWordIndex: 0,
    currentCharIndex: 0,
    started: false,
    finished: false,
    correctChars: 0,
    incorrectChars: 0,
    totalTypedChars: 0,
  })

  const handleKey = useCallback(
    (key: string) => {
      if (key === ' ') {
        dispatch({ type: 'SPACE' })
        return
      }

      if (key === 'Backspace') {
        dispatch({ type: 'BACKSPACE' })
        return
      }

      // Printable character: single character, not Space
      if (key.length === 1) {
        // Capture started/finished BEFORE dispatching so we can call side-effects
        // We read from the reducer's next state via the returned new state.
        // Since we can't easily inspect post-dispatch state synchronously inside
        // useCallback without refs, we use a pattern: read current state values
        // directly through closure since useCallback re-creates when state changes.
        const wasStarted = state.started
        const wasFinished = state.finished

        if (wasFinished) return

        dispatch({ type: 'PRINTABLE_KEY', key })

        // Side effects: call onStart on the very first printable key
        if (!wasStarted) {
          onStart()
        }

        // Determine if this keypress completes the test:
        // We need to check if this is the last char of the last word.
        // After dispatch the state won't be available yet in this render,
        // so we calculate it here using the pre-dispatch state values.
        const word = state.words[state.currentWordIndex]
        const isLastWord = state.currentWordIndex === state.words.length - 1
        const isLastChar = state.currentCharIndex + 1 === word.chars.length

        if (isLastWord && isLastChar) {
          onFinish()
        }

        return
      }

      // All other keys (Shift, Ctrl, Alt, Tab, etc.) — silently ignored
    },
    [state, onStart, onFinish]
  )

  return {
    words: state.words,
    currentWordIndex: state.currentWordIndex,
    currentCharIndex: state.currentCharIndex,
    started: state.started,
    finished: state.finished,
    correctChars: state.correctChars,
    incorrectChars: state.incorrectChars,
    totalTypedChars: state.totalTypedChars,
    handleKey,
  }
}
