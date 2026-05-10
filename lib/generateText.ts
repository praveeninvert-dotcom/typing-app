// Change from previous version:
//   BEFORE: randomly sampled N words from a flat word pool
//   NOW:    picks one complete paragraph at random from the difficulty set,
//           splits it into words, and returns a Word[] array
//
// This means every test run is a coherent piece of text, not a random word soup.
// Retry picks a NEW random paragraph from the same difficulty set.

import { paragraphs } from './wordLists'
import type { Difficulty } from './wordLists'
import type { Word, Char } from '../types'

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildWordArray(text: string): Word[] {
  return text.split(' ').map((raw) => {
    const chars: Char[] = raw.split('').map((ch) => ({
      expected: ch,
      typed: null,
      state: 'untyped' as const,
    }))
    return {
      chars,
      state: 'untyped' as const,
    }
  })
}

export function generateText(difficulty: Difficulty): Word[] {
  const set = paragraphs[difficulty]
  const paragraph = pickRandom(set)
  return buildWordArray(paragraph)
}

// Returns a different paragraph from the set on retry.
// Because pickRandom is called fresh each time, there is a 1-in-N chance
// of getting the same paragraph twice in a row. For N=4 sets this is fine.
// If you want guaranteed rotation, use a ref to track the last index externally.