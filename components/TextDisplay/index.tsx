'use client'
import { memo, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import type { Word, Char } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './TextDisplay.module.css'

const shakeVariants = {
  idle: { x: 0 },
  shake: {
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.25, ease: 'easeInOut' as const },
  },
}

interface TextDisplayProps {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
  shakeCount: number
  flashWordIndex: number | null
  isTyping: boolean
}

interface CharSpanProps {
  char: Char
  isCursor: boolean
  isTyping: boolean
}

const CharSpan = memo(function CharSpan({ char, isCursor, isTyping }: CharSpanProps) {
  return (
    <span
      className={`${styles.char} ${styles[char.state]} ${isCursor ? styles.cursor : ''} ${isCursor && isTyping ? styles.cursorPaused : ''}`}
    >
      {char.expected}
    </span>
  )
})
CharSpan.displayName = 'CharSpan'

interface WordSpanProps {
  word: Word
  isActive: boolean
  currentCharIndex: number
  shakeKey: number
  isFlash: boolean
  isTyping: boolean
  reducedMotion: boolean
}

function WordSpanInner({ word, isActive, currentCharIndex, shakeKey, isFlash, isTyping, reducedMotion }: WordSpanProps) {
  const controls = useAnimation()

  useEffect(() => {
    if (shakeKey > 0 && isActive && !reducedMotion) {
      controls.start('shake').then(() => controls.start('idle'))
    }
  }, [shakeKey, isActive, reducedMotion, controls])

  const wordClassName = [
    styles.word,
    isActive ? styles.active : '',
    word.state === 'incorrect' ? styles.wrongWord : '',
    isFlash ? styles.flash : '',
  ].filter(Boolean).join(' ')

  const chars = word.chars.map((char, charIndex) => (
    <CharSpan
      key={charIndex}
      char={char}
      isCursor={isActive && charIndex === currentCharIndex}
      isTyping={isTyping}
    />
  ))

  if (isActive) {
    return (
      <>
        <motion.span
          className={wordClassName}
          variants={shakeVariants}
          animate={controls}
          initial="idle"
          data-active="true"
        >
          {chars}
          {currentCharIndex === word.chars.length && (
            <span className={`${styles.char} ${styles.cursor} ${isTyping ? styles.cursorPaused : ''}`}>{' '}</span>
          )}
        </motion.span>
        <span className={styles.space}>{' '}</span>
      </>
    )
  }

  return (
    <>
      <span className={wordClassName}>
        {chars}
      </span>
      <span className={styles.space}>{' '}</span>
    </>
  )
}

const WordSpan = memo(WordSpanInner)
WordSpan.displayName = 'WordSpan'

export function TextDisplay({ words, currentWordIndex, currentCharIndex, shakeCount, flashWordIndex, isTyping }: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const activeWord = container.querySelector('[data-active="true"]') as HTMLElement | null
    if (!activeWord) return
    const wordTop = activeWord.offsetTop
    const wordBottom = wordTop + activeWord.offsetHeight
    const containerHeight = container.clientHeight
    const scrollTop = container.scrollTop
    if (wordBottom > scrollTop + containerHeight) {
      container.scrollTo({ top: wordTop - containerHeight / 3, behavior: 'smooth' })
    }
  }, [currentWordIndex])

  return (
    <div ref={containerRef} className={styles.container}>
      {words.map((word, wordIndex) => (
        <WordSpan
          key={wordIndex}
          word={word}
          isActive={wordIndex === currentWordIndex}
          currentCharIndex={wordIndex === currentWordIndex ? currentCharIndex : 0}
          shakeKey={wordIndex === currentWordIndex ? shakeCount : 0}
          isFlash={wordIndex === flashWordIndex}
          isTyping={wordIndex === currentWordIndex ? isTyping : false}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}
