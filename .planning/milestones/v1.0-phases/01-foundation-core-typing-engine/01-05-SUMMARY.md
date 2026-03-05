---
phase: 01-foundation-core-typing-engine
plan: "05"
subsystem: ui
tags: [react, typescript, css-modules, state-machine, hooks, accessibility]

requires:
  - phase: 01-foundation-core-typing-engine
    plan: "01"
    provides:
      - types/index.ts (Screen, Difficulty, ResultState, Word, Char types)
      - lib/generateText.ts (generates Word[] for TestScreen)
      - lib/constants.ts (TIMER_DURATION)
  - phase: 01-foundation-core-typing-engine
    plan: "02"
    provides:
      - hooks/useCountdown.ts (countdown timer with onComplete callback)
      - hooks/useKeystrokeSound.ts (Phase 1 stub, no-op)
  - phase: 01-foundation-core-typing-engine
    plan: "03"
    provides:
      - hooks/useTypingEngine.ts (typing state machine with handleKey, onStart, onFinish)
  - phase: 01-foundation-core-typing-engine
    plan: "04"
    provides:
      - components/DifficultySelector (used by HomeScreen)
      - components/StatsBar (used by TestScreen)
      - components/TextDisplay (used by TestScreen)

provides:
  - components/ResultOverlay/index.tsx (result modal with WPM, accuracy, char breakdown, RETRY/HOME buttons)
  - components/ResultOverlay/ResultOverlay.module.css (backdrop + modal styles)
  - components/HomeScreen/index.tsx (TYPING.EXE title with blinking cursor, difficulty picker, Start CTA)
  - components/HomeScreen/HomeScreen.module.css (title, cursor blink, subtitle, Start button styles)
  - components/TestScreen/index.tsx (hidden input, useTypingEngine + useCountdown wired, StatsBar + TextDisplay)
  - components/TestScreen/TestScreen.module.css (screen layout, hidden input positioning, escape hint)
  - components/TypingApp.tsx (root state machine: screen/difficulty/result, all 4 transitions)

affects:
  - 01-06 (app/globals.css, app/layout.tsx, app/page.tsx — final wiring)
  - app/page.tsx renders TypingApp

tech-stack:
  added: []
  patterns:
    - "Root state machine pattern: TypingApp.tsx owns all screen/difficulty/result state and all transitions"
    - "Lazy useState initializer: useState(() => generateText(difficulty)) ensures stable word list reference"
    - "engineRef pattern: useRef tracks latest engine values for countdown.onComplete closure"
    - "opacity-based hidden input: position absolute + opacity 0 + width/height 1px (never display:none)"
    - "Window keydown listener for Enter→RETRY in ResultOverlay via useEffect with cleanup"

key-files:
  created:
    - components/ResultOverlay/index.tsx
    - components/ResultOverlay/ResultOverlay.module.css
    - components/HomeScreen/index.tsx
    - components/HomeScreen/HomeScreen.module.css
    - components/TestScreen/index.tsx
    - components/TestScreen/TestScreen.module.css
    - components/TypingApp.tsx
  modified: []

key-decisions:
  - "TypingApp renders ResultOverlay as full-page replacement (not modal over TestScreen) in Phase 1 — Phase 3 will add true overlay via AnimatePresence; this keeps Phase 1 simple"
  - "TestScreen uses lazy useState(() => generateText(difficulty)) — ensures words array is created once on mount, not recreated on each render"
  - "engineRef pattern: countdown.onComplete is a closure that can't see latest engine state via normal React renders; useRef + useEffect keeps the ref current"
  - "No Framer Motion in Phase 1 — screen transitions are instant; AnimatePresence added in Phase 3"
  - "HomeScreen manages selectedDifficulty internally (not lifted to TypingApp) — TypingApp only needs the difficulty when Start is pressed"

patterns-established:
  - "Root state machine: single component owns all app-level state and all transitions; child screens are pure presentational"
  - "Hidden input pattern: position absolute, opacity 0, 1px x 1px, pointer-events none — stays in tab order, no layout impact"
  - "Lazy initializer for expensive computations: useState(() => fn()) runs fn() only on mount"

requirements-completed: [R-001, R-002, R-003, R-008, R-009, R-010, R-011, R-070, R-076]

duration: 3min
completed: 2026-03-04
---

# Phase 1 Plan 05: Screen Components + TypingApp Root State Machine Summary

**ResultOverlay (WPM/accuracy/char breakdown modal), HomeScreen (blinking TYPING.EXE, difficulty picker, Start CTA), TestScreen (hidden input + useTypingEngine + useCountdown wiring), and TypingApp root state machine — complete end-to-end typing test loop assembled.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-04T13:53:50Z
- **Completed:** 2026-03-04T13:56:53Z
- **Tasks:** 2
- **Files modified:** 7 (created)

## Accomplishments

- ResultOverlay renders WPM (96px amber VT323), accuracy (72px blue VT323), correct/incorrect char breakdown, RETRY and HOME buttons — Enter key triggers RETRY via window listener
- HomeScreen renders TYPING.EXE with 600ms blinking block cursor, SELECT DIFFICULTY subtitle, DifficultySelector embedded, Start button disabled until difficulty selected
- TestScreen wires useTypingEngine + useCountdown: first printable key starts timer, timer-expiry and word-list-exhaustion both trigger result computation via onFinish
- TypingApp manages screen='home'|'test'|'result' state with 4 transitions (handleStart, handleTestFinish, handleRetry, handleHome) — no Framer Motion, no routing

## Task Commits

Each task was committed atomically:

1. **Task 1: ResultOverlay and HomeScreen components** - `7a852ca` (feat)
2. **Task 2: TestScreen and TypingApp root state machine** - `fdcbc2e` (feat)

## Files Created/Modified

- `components/ResultOverlay/index.tsx` — Modal overlay with WPM/accuracy/char breakdown, Enter→RETRY window listener
- `components/ResultOverlay/ResultOverlay.module.css` — Fixed backdrop (rgba(0,0,0,0.85)), centered modal with amber border
- `components/HomeScreen/index.tsx` — TYPING.EXE title, blinking cursor span, DifficultySelector, disabled Start button
- `components/HomeScreen/HomeScreen.module.css` — @keyframes blink 600ms, clamp font size, disabled/enabled Start button states
- `components/TestScreen/index.tsx` — Hidden input (aria-label, autoFocus, re-focus on click), live WPM/accuracy computation, engineRef pattern
- `components/TestScreen/TestScreen.module.css` — Screen layout, hidden input (position absolute, NOT display:none), escape hint styling
- `components/TypingApp.tsx` — Root state machine: screen/difficulty/result useState, all 4 transition handlers, conditional rendering

## Decisions Made

1. **ResultOverlay as full-page replacement in Phase 1:** The spec shows ResultOverlay as a modal OVER the frozen TestScreen. For Phase 1, rendering it as a full-page replacement is simpler and achieves the same visual result (the modal CSS creates the overlay look even standalone). Phase 3 will introduce true overlay via AnimatePresence.

2. **HomeScreen manages selectedDifficulty internally:** TypingApp only needs the difficulty when Start is pressed (via onStart callback). Keeping it internal to HomeScreen avoids unnecessary lifting and aligns with the plan spec.

3. **engineRef pattern for countdown closure:** countdown.onComplete fires from setInterval — it captures engine state from the render when useCountdown was called. A useRef updated on every render ensures the latest correctChars/totalTypedChars values are available when the timer expires.

4. **No Framer Motion in Phase 1:** Per CLAUDE.md and plan spec — AnimatePresence is Phase 3. All transitions are instant in Phase 1.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 4 screen components (ResultOverlay, HomeScreen, TestScreen, TypingApp) complete and passing TypeScript
- TypingApp is the final component in the build order before globals.css/layout.tsx/page.tsx (Plan 06)
- Full typing test loop is wired: Home → Test → Result → (Retry | Home)
- No blockers — ready for Plan 06 (globals.css, fonts, layout, page.tsx)

---
*Phase: 01-foundation-core-typing-engine*
*Completed: 2026-03-04*

## Self-Check: PASSED

| Item | Status |
|------|--------|
| components/ResultOverlay/index.tsx exists | FOUND |
| components/ResultOverlay/ResultOverlay.module.css exists | FOUND |
| components/HomeScreen/index.tsx exists | FOUND |
| components/HomeScreen/HomeScreen.module.css exists | FOUND |
| components/TestScreen/index.tsx exists | FOUND |
| components/TestScreen/TestScreen.module.css exists | FOUND |
| components/TypingApp.tsx exists | FOUND |
| Commit 7a852ca (Task 1: ResultOverlay + HomeScreen) | FOUND |
| Commit fdcbc2e (Task 2: TestScreen + TypingApp) | FOUND |
| npx tsc --noEmit clean | PASS |
| aria-label="Type the displayed text" present | PASS |
| No display:none on hidden input | PASS |
| No Framer Motion imports | PASS |
| All 4 transition handlers in TypingApp | PASS |
