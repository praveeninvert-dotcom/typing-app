# Architecture Standards — Retro Typing Test
# Place at: standards/ARCHITECTURE-STANDARDS.md

## Project Structure

typing-test/
  app/
    layout.tsx          Root layout. Font imports via next/font/google. Global meta.
    page.tsx            Renders TypingApp only. Nothing else.
    globals.css         Tailwind directives. CSS custom properties. CRT overlay.
  components/
    TypingApp.tsx       Root state machine. Owns screen + difficulty + result state.
    HomeScreen/
      HomeScreen.tsx
      HomeScreen.module.css
    TestScreen/
      TestScreen.tsx
      TestScreen.module.css
    TextDisplay/
      TextDisplay.tsx
      TextDisplay.module.css
    StatsBar/
      StatsBar.tsx
      StatsBar.module.css
    ResultOverlay/
      ResultOverlay.tsx
      ResultOverlay.module.css
    DifficultySelector/
      DifficultySelector.tsx
      DifficultySelector.module.css
  hooks/
    useTypingEngine.ts
    useCountdown.ts
    useKeystrokeSound.ts
  lib/
    wordLists.ts
    generateText.ts
    constants.ts
  types/
    index.ts

---

## Naming Conventions

Files and folders: kebab-case
Component function names: PascalCase
Hooks: camelCase starting with use
Constants: SCREAMING_SNAKE_CASE in lib/constants.ts
Types and interfaces: PascalCase

---

## State Architecture

No global state library. No Zustand. No React Context.

TypingApp.tsx owns:
  screen: Screen
  difficulty: Difficulty or null
  result: ResultState or null

TestScreen.tsx delegates to hooks:
  useTypingEngine — all typing logic and character state
  useCountdown — timer countdown
  useKeystrokeSound — audio, returns playCorrect and playWrong only

---

## Component Responsibilities

Presentational (receive all data as props, no hooks):
  StatsBar         receives wpm, accuracy, timeLeft, started
  TextDisplay      receives words array, currentWordIndex, currentCharIndex
  DifficultySelector  receives selected and onChange
  ResultOverlay    receives result, onRetry, onHome

Screen components (own local UI state, use hooks):
  HomeScreen       owns selected difficulty, calls onStart(difficulty)
  TestScreen       owns test state via hooks, calls onFinish(result) and onQuit

TypingApp.tsx:
  Owns screen, difficulty, result
  Renders the correct screen based on state
  Wraps screens in AnimatePresence for transitions
  Renders ResultOverlay on top of TestScreen when screen is 'result'

---

## Data Flow

TypingApp
  to HomeScreen:    difficulty, onStart(difficulty)
  to TestScreen:    difficulty, onFinish(result), onQuit
  to ResultOverlay: result, onRetry, onHome

TestScreen
  to TextDisplay:   words, currentWordIndex, currentCharIndex
  to StatsBar:      wpm, accuracy, timeLeft, started

---

## CSS Module + Tailwind Split

Tailwind for: layout, spacing, flex, grid, responsive breakpoints, padding, margin.
CSS Modules for: glow effects, CRT-specific styles, custom keyframe animations,
                 anything Tailwind cannot express cleanly.

Never use inline styles for animation properties — use Framer Motion or CSS Modules.

---

## File-Level Rules

Every component file exports one default component.
Every component file has a TypeScript props interface at the top.
Every component has a corresponding CSS Module file, even if minimal.
Animation variants are const at top of file, before the component function.
No barrel index.ts files — import directly from component files.

---

## What Does Not Belong in This Project

No pages/ directory — App Router only.
No api/ directory — no server routes.
No middleware.ts — no route protection needed.
No .env files — no secrets, no external services.
No next.config.js modifications beyond defaults.
