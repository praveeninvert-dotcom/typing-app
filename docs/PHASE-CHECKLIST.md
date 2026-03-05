# Phase Checklist — Retro Typing Test
# Place at: docs/PHASE-CHECKLIST.md
# Run through the relevant section before marking any phase complete.

---

## Universal (Every Phase)

Code quality:
  npx tsc --noEmit passes with zero errors
  npm run lint passes
  No console.log in committed code
  No TODO comments without a note explaining them

Git:
  All work committed, git status is clean
  Commit messages follow format: type(scope): description

Tests:
  npm run test passes with zero failures
  New logic has corresponding tests
  No tests skipped with .skip without a documented reason

---

## Phase 1: Foundation + Core Typing Engine

Setup:
  npm run dev starts without console errors
  TypeScript strict mode confirmed in tsconfig.json
  Press Start 2P and VT323 fonts visually loading correctly
  CSS custom properties visible in browser devtools
  CRT scanline effect visible across all screens
  Vignette darkens corners

Types and data:
  types/index.ts defines: Screen, Difficulty, CharState, WordState, Word, Char, TestState, ResultState, AppState
  lib/constants.ts defines all named constants (no magic numbers anywhere)
  lib/wordLists.ts has easy (200), medium (500), hard (1000) word entries
  lib/generateText.ts returns exactly WORDS_PER_TEST words from correct pool
  Different calls to generateText return different sequences

Hooks:
  useCountdown: starts only on start(), ticks every second, calls onComplete at zero, reset() works
  useTypingEngine: correct char advances index, wrong char marks incorrect without advancing
  useTypingEngine: space advances word regardless of correctness
  useTypingEngine: backspace deletes within current word only, no boundary crossing
  useTypingEngine: space/backspace before first char does not set started = true
  useTypingEngine: isComplete = true when word list exhausted
  useTypingEngine: input ignored after isComplete

Components:
  HomeScreen: title TYPING.EXE renders with blinking cursor
  HomeScreen: subtitle SELECT DIFFICULTY renders
  DifficultySelector: EASY, MEDIUM, HARD all render with correct descriptor text
  DifficultySelector: role="radiogroup" and role="radio" present
  DifficultySelector: aria-checked updates on selection
  Start button: disabled before difficulty selected, aria-disabled="true"
  Start button: enabled after difficulty selected
  TextDisplay: all characters render with correct initial state
  TextDisplay: correct chars turn green, incorrect turn red, cursor shows on current
  TextDisplay: current word has amber underline
  TestScreen: hidden input is auto-focused on mount
  TestScreen: clicking anywhere re-focuses hidden input
  ResultOverlay: renders WPM, accuracy, correct count, incorrect count
  ResultOverlay: Retry calls onRetry, Home calls onHome
  StatsBar: opacity 0 before first keypress, height reserved (no layout shift)

Accessibility:
  axe-core scan passes on home screen
  axe-core scan passes on test screen
  Tab navigation works on home screen

---

## Phase 2: Live Stats + Result Polish

Stats accuracy:
  WPM formula correct: (correctChars / 5) / (elapsedSeconds / 60)
  Accuracy formula correct: Math.round((correctChars / totalTypedChars) * 100)
  Accuracy shows '--' before first character typed
  WPM updates every second during test
  Accuracy updates every second during test

StatsBar animation:
  StatsBar invisible before first keypress (opacity 0, no layout shift confirmed)
  StatsBar animates in smoothly on first keypress (no jump)
  TIME turns red (--color-red-wrong) when timeLeft = 10
  TIME pulses scale animation when in warning state

Result overlay:
  WPM count-up plays over 800ms easeOut
  Accuracy count-up plays over 600ms easeOut with 100ms delay
  Character breakdown appears after accuracy finishes (fade in)
  Correct count is green, incorrect count is red
  Retry: fresh word list, same difficulty, no home screen
  Home: returns to home, difficulty selection reset

---

## Phase 3: Sounds + Edge Cases + Animations + A11y

Sounds:
  Correct keypress plays short click sound
  Wrong keypress plays distinct lower tone
  AudioContext created on first keydown, not before
  Audio does not error in Chrome, Firefox, Safari
  No memory leaks: oscillator disconnects after each sound

Edge cases:
  Caps Lock warning appears when CapsLock is on
  Caps Lock warning disappears when CapsLock turned off
  Caps Lock warning has role="alert" — verified via screen reader or axe
  Escape shows quit confirmation and timer freezes
  YES in quit confirmation: goes to home, no result
  NO in quit confirmation: dismisses, timer resumes at same value
  Escape while confirmation open: dismisses (same as NO)

Animations (verify each plays correctly):
  Home stagger: title, subtitle, buttons fade in with stagger on mount
  Difficulty select: pulse and amber underline slide
  Start press: scale flash before transition
  Screen transitions: outgoing fades + scales, incoming fades + slides up
  Wrong key: current word shakes horizontally
  Correct word: brief green flash
  TextDisplay: smooth scroll when active line changes
  Cursor blink pauses while typing, resumes after idle
  Result backdrop: fades to 0.85 opacity
  Result modal: springs from scale 0.85 to 1.0
  Stats count-up: WPM and accuracy both animate from 0
  Character breakdown: fades in after accuracy

Accessibility:
  axe-core passes on home screen
  axe-core passes on test screen
  axe-core passes on result overlay
  Keyboard-only navigation manually tested: home, test, result, quit confirmation
  Focus trapped in quit confirmation
  Focus returns to hidden input when quit confirmation dismissed
  Focus trapped in result overlay
  Retry button receives focus when result overlay mounts
  Visually hidden aria-live element announces test complete
  All focus rings visually visible
