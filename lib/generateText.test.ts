import { generateText } from './generateText'
import type { Difficulty } from './wordLists'

describe('generateText', () => {
  // ---------------------------------------------------------------------------
  // Test 1: Word count >= 50 for every difficulty
  // The shortest paragraph in the hard set has exactly 50 words; all others
  // have more. The assertion is "at least 50" — a practical lower bound.
  // ---------------------------------------------------------------------------
  it('returns a Word array with more than 50 words for each difficulty', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
    for (const difficulty of difficulties) {
      const result = generateText(difficulty)
      expect(result.length).toBeGreaterThanOrEqual(50)
    }
  })

  // ---------------------------------------------------------------------------
  // Test 2: Each Word has a non-empty chars array
  // ---------------------------------------------------------------------------
  it('each Word has a non-empty chars array', () => {
    const result = generateText('easy')
    const first = result[0]
    const last = result[result.length - 1]
    expect(first.chars.length).toBeGreaterThan(0)
    expect(last.chars.length).toBeGreaterThan(0)
  })

  // ---------------------------------------------------------------------------
  // Test 3: Each Char has expected string, typed null, and state 'untyped'
  // ---------------------------------------------------------------------------
  it("each Char has expected string, typed null, and state 'untyped'", () => {
    const result = generateText('medium')
    const char = result[0].chars[0]
    expect(typeof char.expected).toBe('string')
    expect(char.expected.length).toBeGreaterThanOrEqual(1)
    expect(char.typed).toBeNull()
    expect(char.state).toBe('untyped')
  })

  // ---------------------------------------------------------------------------
  // Test 4: Each Word has state 'untyped'
  // ---------------------------------------------------------------------------
  it("each Word has state 'untyped'", () => {
    const result = generateText('hard')
    for (const word of result) {
      expect(word.state).toBe('untyped')
    }
  })

  // ---------------------------------------------------------------------------
  // Test 5: Two consecutive calls can return different results (randomness)
  // ---------------------------------------------------------------------------
  it('two consecutive calls can return different results (randomness)', () => {
    let sawDifference = false
    for (let i = 0; i < 5; i++) {
      const a = JSON.stringify(generateText('easy'))
      const b = JSON.stringify(generateText('easy'))
      if (a !== b) {
        sawDifference = true
        break
      }
    }
    expect(
      sawDifference,
      'All 5 pairs of generateText("easy") calls returned identical results — randomness may be broken'
    ).toBe(true)
  })
})
