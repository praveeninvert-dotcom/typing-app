'use client'
import { memo } from 'react'
import type { Word, Char } from '@/types'
import styles from './TextDisplay.module.css'

interface TextDisplayProps {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
}

interface CharSpanProps {
  char: Char
  isCursor: boolean
}

const CharSpan = memo(function CharSpan({ char, isCursor }: CharSpanProps) {
  return (
    <span className={`${styles.char} ${styles[char.state]} ${isCursor ? styles.cursor : ''}`}>
      {char.expected}
    </span>
  )
})
CharSpan.displayName = 'CharSpan'

interface WordSpanProps {
  word: Word
  isActive: boolean
  currentCharIndex: number
}

const WordSpan = memo(function WordSpan({ word, isActive, currentCharIndex }: WordSpanProps) {
  return (
    <>
      <span
        className={`${styles.word} ${isActive ? styles.active : ''} ${word.state === 'incorrect' ? styles.wrongWord : ''}`}
      >
        {word.chars.map((char, charIndex) => (
          <CharSpan
            key={charIndex}
            char={char}
            isCursor={isActive && charIndex === currentCharIndex}
          />
        ))}
        {/* Cursor after last char: when currentCharIndex === word.chars.length */}
        {isActive && currentCharIndex === word.chars.length && (
          <span className={`${styles.char} ${styles.cursor}`}>{' '}</span>
        )}
      </span>
      <span className={styles.space}>{' '}</span>
    </>
  )
})
WordSpan.displayName = 'WordSpan'

export function TextDisplay({ words, currentWordIndex, currentCharIndex }: TextDisplayProps) {
  return (
    <div className={styles.container}>
      {words.map((word, wordIndex) => (
        <WordSpan
          key={wordIndex}
          word={word}
          isActive={wordIndex === currentWordIndex}
          currentCharIndex={wordIndex === currentWordIndex ? currentCharIndex : 0}
        />
      ))}
    </div>
  )
}
