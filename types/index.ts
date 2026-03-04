export type Screen = 'home' | 'test' | 'result'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type CharState = 'untyped' | 'correct' | 'incorrect'
export type WordState = 'untyped' | 'active' | 'correct' | 'incorrect'

export interface AppState {
  screen: Screen
  difficulty: Difficulty | null
}

export interface Char {
  expected: string
  typed: string | null
  state: CharState
}

export interface Word {
  chars: Char[]
  state: WordState
}

export interface TestState {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
  started: boolean
  finished: boolean
  timeLeft: number
  correctChars: number
  incorrectChars: number
  totalTypedChars: number
  activeKey: string | null
  capsLockOn: boolean
  quitting: boolean
}

export interface ResultState {
  wpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
}
