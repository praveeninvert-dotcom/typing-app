import { renderHook, act } from '@testing-library/react'
import { useTypingEngine, calculateWPM, calculateAccuracy } from '../useTypingEngine'
import type { Word } from '@/types'

// Build a minimal fixture so tests don't depend on random word lists
function makeWords(wordStrings: string[]): Word[] {
  return wordStrings.map((word) => ({
    state: 'untyped' as const,
    chars: word.split('').map((char) => ({
      expected: char,
      typed: null,
      state: 'untyped' as const,
    })),
  }))
}

// Default fixture: two words "hi" and "go"
const makeFixture = () => makeWords(['hi', 'go'])

describe('useTypingEngine', () => {
  // ---------------------------------------------------------------------------
  // Test 1: Initial state
  // ---------------------------------------------------------------------------
  it('starts with correct initial state', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    expect(result.current.currentWordIndex).toBe(0)
    expect(result.current.currentCharIndex).toBe(0)
    expect(result.current.started).toBe(false)
    expect(result.current.finished).toBe(false)
    expect(result.current.correctChars).toBe(0)
    expect(result.current.incorrectChars).toBe(0)
    expect(result.current.totalTypedChars).toBe(0)
    expect(onStart).not.toHaveBeenCalled()
    expect(onFinish).not.toHaveBeenCalled()
  })

  // ---------------------------------------------------------------------------
  // Test 2: Typing a correct character marks it 'correct' and advances cursor
  // ---------------------------------------------------------------------------
  it('marks correct character as correct and advances cursor', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    // First word is "hi" — type 'h' (correct)
    act(() => {
      result.current.handleKey('h')
    })

    expect(result.current.words[0].chars[0].state).toBe('correct')
    expect(result.current.words[0].chars[0].typed).toBe('h')
    expect(result.current.currentCharIndex).toBe(1)
    expect(result.current.correctChars).toBe(1)
    expect(result.current.totalTypedChars).toBe(1)
  })

  // ---------------------------------------------------------------------------
  // Test 3: Typing an incorrect character marks it 'incorrect'
  // ---------------------------------------------------------------------------
  it('marks incorrect character as incorrect and advances cursor', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    // First word is "hi" — type 'x' (wrong)
    act(() => {
      result.current.handleKey('x')
    })

    expect(result.current.words[0].chars[0].state).toBe('incorrect')
    expect(result.current.words[0].chars[0].typed).toBe('x')
    expect(result.current.currentCharIndex).toBe(1)
    expect(result.current.incorrectChars).toBe(1)
    expect(result.current.totalTypedChars).toBe(1)
    expect(result.current.correctChars).toBe(0)
  })

  // ---------------------------------------------------------------------------
  // Test 4: Backspace after correct char reverts to untyped
  // ---------------------------------------------------------------------------
  it('reverts a correct character to untyped on Backspace', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    // Type 'h' (correct), then Backspace
    act(() => {
      result.current.handleKey('h')
    })
    act(() => {
      result.current.handleKey('Backspace')
    })

    expect(result.current.words[0].chars[0].state).toBe('untyped')
    expect(result.current.words[0].chars[0].typed).toBeNull()
    expect(result.current.currentCharIndex).toBe(0)
    expect(result.current.correctChars).toBe(0)
    expect(result.current.totalTypedChars).toBe(0)
  })

  // ---------------------------------------------------------------------------
  // Test 5: Backspace at position 0 does nothing (no boundary crossing)
  // ---------------------------------------------------------------------------
  it('does nothing when Backspace is pressed at position 0', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    act(() => {
      result.current.handleKey('Backspace')
    })

    expect(result.current.currentCharIndex).toBe(0)
    expect(result.current.currentWordIndex).toBe(0)
    expect(result.current.totalTypedChars).toBe(0)
    expect(result.current.started).toBe(false)
  })

  // ---------------------------------------------------------------------------
  // Test 6: Space before typing does nothing, does NOT start timer
  // ---------------------------------------------------------------------------
  it('ignores Space before first character and does not start timer', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    act(() => {
      result.current.handleKey(' ')
    })

    expect(result.current.started).toBe(false)
    expect(result.current.currentWordIndex).toBe(0)
    expect(result.current.currentCharIndex).toBe(0)
    expect(onStart).not.toHaveBeenCalled()
  })

  // ---------------------------------------------------------------------------
  // Test 7: Space after typing a word advances to next word
  // ---------------------------------------------------------------------------
  it('advances to next word on Space after typing current word', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    // Type "hi" completely (both chars)
    act(() => { result.current.handleKey('h') })
    act(() => { result.current.handleKey('i') })
    // Then press Space to advance
    act(() => { result.current.handleKey(' ') })

    expect(result.current.currentWordIndex).toBe(1)
    expect(result.current.currentCharIndex).toBe(0)
  })

  // ---------------------------------------------------------------------------
  // Test 8: First printable key sets started=true and calls onStart once
  // ---------------------------------------------------------------------------
  it('sets started=true and calls onStart exactly once on first printable key', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const { result } = renderHook(() =>
      useTypingEngine({ words: makeFixture(), onStart, onFinish })
    )

    expect(result.current.started).toBe(false)

    act(() => {
      result.current.handleKey('h')
    })

    expect(result.current.started).toBe(true)
    expect(onStart).toHaveBeenCalledTimes(1)

    // Second key should NOT call onStart again
    act(() => {
      result.current.handleKey('i')
    })
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  // ---------------------------------------------------------------------------
  // Test 9: Finishing last word sets finished=true and calls onFinish
  // ---------------------------------------------------------------------------
  it('sets finished=true and calls onFinish when last char of last word is typed', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    // Use a single two-character word "hi" only
    const singleWordFixture = makeWords(['hi'])
    const { result } = renderHook(() =>
      useTypingEngine({ words: singleWordFixture, onStart, onFinish })
    )

    act(() => { result.current.handleKey('h') })
    expect(result.current.finished).toBe(false)
    expect(onFinish).not.toHaveBeenCalled()

    act(() => { result.current.handleKey('i') })
    expect(result.current.finished).toBe(true)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  // ---------------------------------------------------------------------------
  // Test 10: All input is ignored after finished=true
  // ---------------------------------------------------------------------------
  it('ignores all input after finished', () => {
    const onStart = vi.fn()
    const onFinish = vi.fn()
    const singleWordFixture = makeWords(['hi'])
    const { result } = renderHook(() =>
      useTypingEngine({ words: singleWordFixture, onStart, onFinish })
    )

    // Finish the word
    act(() => { result.current.handleKey('h') })
    act(() => { result.current.handleKey('i') })
    expect(result.current.finished).toBe(true)

    // Snapshot current state
    const wordsBefore = JSON.stringify(result.current.words)
    const correctBefore = result.current.correctChars

    // These should all be ignored
    act(() => { result.current.handleKey('x') })
    act(() => { result.current.handleKey('Backspace') })
    act(() => { result.current.handleKey(' ') })

    expect(result.current.finished).toBe(true)
    expect(result.current.correctChars).toBe(correctBefore)
    expect(JSON.stringify(result.current.words)).toBe(wordsBefore)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  // ---------------------------------------------------------------------------
  // calculateWPM and calculateAccuracy helper tests
  // ---------------------------------------------------------------------------
  describe('calculateWPM', () => {
    it('returns correct WPM using the formula (correctChars/5)/(elapsedSeconds/60)', () => {
      // 300 correct chars in 60 seconds = (300/5)/(60/60) = 60 WPM
      expect(calculateWPM(300, 60)).toBe(60)
    })

    it('returns 0 when elapsedSeconds is 0', () => {
      expect(calculateWPM(100, 0)).toBe(0)
    })
  })

  describe('calculateAccuracy', () => {
    it('returns correct accuracy percentage', () => {
      // 90 correct out of 100 total = 90%
      expect(calculateAccuracy(90, 100)).toBe(90)
    })

    it('returns 0 when totalTypedChars is 0', () => {
      expect(calculateAccuracy(0, 0)).toBe(0)
    })
  })
})
