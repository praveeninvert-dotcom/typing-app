# ROADMAP.md
# Place at: .planning/ROADMAP.md

## Milestone: v1.0 — Functional Retro Typing Test

Goal: All requirements R-001 through R-077 working, tested, and accessible.

---

## Phase 1: Foundation + Core Typing Engine

Status: Planned
Requirements: R-001 to R-011, R-070, R-071, R-075, R-076

Goal: User can start a test, type words, see characters marked correct or incorrect.
Timer starts on first keypress. Test ends at zero. Basic result exists.
No polish, no sounds, no animations — just the core mechanic working.

Includes:
  app/globals.css — CSS custom properties, CRT overlay, Tailwind
  app/layout.tsx — Google Fonts, root layout, meta
  app/page.tsx — renders TypingApp only
  types/index.ts — all types: Screen, Difficulty, CharState, WordState, Word, Char, TestState, ResultState
  lib/constants.ts — TIMER_DURATION, WORDS_PER_TEST, CORRECT_FREQ, etc.
  lib/wordLists.ts — easy 200 words, medium 500 words, hard 1000 words
  lib/generateText.ts — samples WORDS_PER_TEST from pool, builds Word array
  hooks/useCountdown.ts — start(), reset(), timeLeft, onComplete callback
  hooks/useTypingEngine.ts — char comparison, word advancement, backspace, WPM, accuracy, isComplete
  components/DifficultySelector — radiogroup with correct ARIA
  components/StatsBar — renders stats with opacity:0 until started, no animation yet
  components/TextDisplay — character spans with states and cursor
  components/ResultOverlay — basic layout, Retry and Home wired, no animation yet
  components/HomeScreen — title, subtitle, DifficultySelector, Start button
  components/TestScreen — hidden input, auto-focus, re-focus on click
  components/TypingApp.tsx — screen state machine

Exit criteria: Select difficulty. Start. Type. Characters color correctly.
Backspace within word. Space advances. Timer counts to zero. Result shows WPM and accuracy.
Retry and Home work. Tab navigation works. axe-core passes.

**Plans:** 6/6 plans complete

Plans:
- [x] 01-01-PLAN.md — Project scaffold + types, constants, word lists, generateText (DONE: 44ecc11, 0f7876a)
- [x] 01-02-PLAN.md — useCountdown hook + useKeystrokeSound stub (DONE: 95af7a3, baf730f)
- [x] 01-03-PLAN.md — useTypingEngine TDD (typing state machine) (DONE: 32d4b65, 61dd363)
- [x] 01-04-PLAN.md — DifficultySelector, StatsBar, TextDisplay components (DONE: eb1ed34, f64b4bd)
- [x] 01-05-PLAN.md — ResultOverlay, HomeScreen, TestScreen, TypingApp (DONE: 7a852ca, fdcbc2e)
- [ ] 01-06-PLAN.md — App shell (globals.css, layout.tsx, page.tsx) + axe-core verification

---

## Phase 2: Live Stats + Result Polish

Status: In Progress
Requirements: R-020 to R-034

Goal: Stats fully live. Result overlay has count-up animations and complete data.
StatsBar animates in on first keypress. Timer warns at 10 seconds.

Includes:
  WPM and accuracy recalculating every second
  StatsBar opacity animation on first keypress, no layout shift
  TIME turning red and pulsing at 10 seconds
  ResultOverlay count-up: WPM 800ms, accuracy 600ms with delay
  Character breakdown with correct (green) and incorrect (red) counts
  Character breakdown fades in after accuracy finishes
  Retry resets all state and generates new word list for same difficulty
  Home resets difficulty selection

Exit criteria: Stats accurate during test. StatsBar no layout shift.
TIME pulses at 10s. Result shows all data with count-up. Retry and Home fully work.

**Plans:** 2/3 plans executed

Plans:
- [x] 02-01-PLAN.md — Live WPM (5-second guard), StatsBar Framer Motion fade-in, TIME red pulse at 10s (DONE: fd93214)
- [ ] 02-02-PLAN.md — ResultOverlay count-up animations (WPM 800ms, accuracy 600ms) + character breakdown fade-in
- [ ] 02-03-PLAN.md — AnimatePresence screen transitions (200ms fade) + Retry/Home wiring + human verify

---

## Phase 3: Sounds + Edge Cases + Animations + A11y

Status: Planned
Requirements: R-040 to R-042, R-050 to R-057, R-060 to R-068, R-072 to R-074, R-077

Goal: Full production quality. All animations, all edge cases, full a11y.

Includes:
  hooks/useKeystrokeSound.ts — Web Audio API, correct (square 800Hz 60ms) and wrong (sawtooth 200Hz 100ms)
  AudioContext on first keydown, resume if suspended, disconnect after each sound
  Caps Lock warning banner with role="alert", fades in/out
  Escape quit confirmation with timer freeze, YES/NO, focus trap
  All Framer Motion animations: home stagger, screen transitions via AnimatePresence,
    difficulty select pulse and underline, start button flash, wrong key shake,
    correct word flash, TextDisplay smooth scroll, result spring, backdrop fade,
    stats count-up, character breakdown fade
  Cursor blink pause on active typing with 300ms debounce
  StatsBar WPM aria-live="polite"
  Quit confirmation role="dialog" with focus trap
  Result overlay role="dialog" with focus trap, Retry focused on mount
  Visually hidden aria-live announcement on test complete
  axe-core Playwright passing on all three screens

Exit criteria: Sounds play. Caps Lock warning works. Escape quit flow complete.
All animations play correctly. axe-core passes on all screens. Tab navigation verified.
Focus trapped in both overlays. Enter on result triggers Retry.

---

## Phase Status

Phase 1: Complete (6 of 6 plans complete)
Phase 2: In Progress (1 of 3 plans complete)
Phase 3: Planned
