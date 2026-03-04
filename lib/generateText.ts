import type { Difficulty } from '@/types'
import type { Word, Char } from '@/types'
import { WORDS_PER_TEST } from './constants'
import { wordLists } from './wordLists'

export function generateText(difficulty: Difficulty): Word[] {
  const pool = wordLists[difficulty]
  // Fisher-Yates shuffle of a copy — never mutate the source pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, WORDS_PER_TEST)

  return selected.map((word): Word => ({
    state: 'untyped',
    chars: word.split('').map((char): Char => ({
      expected: char,
      typed: null,
      state: 'untyped',
    })),
  }))
}
