---
phase: 03-sounds-edge-cases-animations-a11y
plan: 01
subsystem: ui
tags: [web-audio-api, react, typescript, css-modules, accessibility]

# Dependency graph
requires:
  - phase: 02-tests-and-polish
    provides: TestScreen component and useKeystrokeSound stub with matching interface
provides:
  - Web Audio API typewriter sounds (square wave correct, sawtooth incorrect)
  - SND toggle button in TestScreen top-right with aria-pressed ARIA attribute
  - Lazy AudioContext initialization on first keypress
affects: [03-sounds-edge-cases-animations-a11y]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lazy AudioContext init via useRef — created on first play call to satisfy CLAUDE.md rule"
    - "useCallback wrapping playTone with soundEnabled in deps — enables hot-toggle without hook remount"
    - "stopPropagation on toggle click — prevents click propagating to main container re-focus handler"

key-files:
  created: []
  modified:
    - hooks/useKeystrokeSound.ts
    - components/TestScreen/index.tsx
    - components/TestScreen/TestScreen.module.css

key-decisions:
  - "soundEnabled default is true — sounds ON on test start, user must opt out (R-040/R-041 expectation)"
  - "e.stopPropagation() on toggle click prevents main onClick re-focusing hidden input after toggle"
  - "Sound determined pre-dispatch: compare key to currentWord.chars[currentCharIndex].expected before engine.handleKey()"

patterns-established:
  - "Pattern: lazy AudioContext in useRef — getCtx() helper ensures single instance, never on mount"
  - "Pattern: playTone helper abstracts oscillator setup, playCorrect/playIncorrect compose from it"

requirements-completed: [R-040, R-041, R-042]

# Metrics
duration: 8min
completed: 2026-03-06
---

# Phase 03 Plan 01: Sounds Summary

**Web Audio API typewriter sounds with square-wave correct (800Hz) and sawtooth incorrect (200Hz) tones, plus amber SND toggle button in TestScreen top-right**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-06T14:01:00Z
- **Completed:** 2026-03-06T14:09:19Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Replaced Phase 1 no-op stub with full Web Audio API implementation using OscillatorNode + GainNode
- AudioContext created lazily on first play call (not on mount) — satisfies CLAUDE.md architecture rule
- Sound toggle button [ SND: ON ] / [ SND: OFF ] visible top-right of test screen with aria-pressed
- Correct/incorrect sounds determined pre-dispatch by comparing key to expected char before engine processes it

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement Web Audio API sounds in useKeystrokeSound** - `90ab8c3` (feat)
2. **Task 2: Add soundEnabled state and SND toggle to TestScreen** - `a5cd53e` (feat)

## Files Created/Modified
- `hooks/useKeystrokeSound.ts` - Full Web Audio implementation with lazy AudioContext, playCorrect (square 800Hz) and playIncorrect (sawtooth 200Hz)
- `components/TestScreen/index.tsx` - soundEnabled state, SND toggle button JSX, wired playCorrect/playIncorrect in handleKeyDown
- `components/TestScreen/TestScreen.module.css` - .sndToggle styles (Press Start 2P, amber, position: absolute top-right) + position: relative on .screen

## Decisions Made
- soundEnabled defaults to true — sounds are the signature feature, user opts out rather than in
- Sound determination before engine.handleKey() call: read engine.words[currentWordIndex].chars[currentCharIndex].expected to classify keypress
- stopPropagation on toggle click — without it, click bubbles to main which re-focuses hidden input

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Sounds fully functional with toggle — R-040, R-041, R-042 satisfied
- Ready for Phase 03-02 (edge cases) and 03-03 (animations/a11y)
- AudioContext lazy init pattern established for future audio work

---
*Phase: 03-sounds-edge-cases-animations-a11y*
*Completed: 2026-03-06*

## Self-Check: PASSED

- FOUND: .planning/phases/03-sounds-edge-cases-animations-a11y/03-01-SUMMARY.md
- FOUND: hooks/useKeystrokeSound.ts
- FOUND: components/TestScreen/index.tsx
- FOUND: components/TestScreen/TestScreen.module.css
- FOUND commit: 90ab8c3 (Task 1)
- FOUND commit: a5cd53e (Task 2)
