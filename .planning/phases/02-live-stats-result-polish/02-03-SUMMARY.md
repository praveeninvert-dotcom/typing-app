---
phase: 02-live-stats-result-polish
plan: "03"
subsystem: ui
tags: [framer-motion, animation, screen-transitions, AnimatePresence]

# Dependency graph
requires:
  - phase: 01-foundation-core-typing-engine
    provides: "TypingApp.tsx root state machine (screen/difficulty/result state, handleStart/handleRetry/handleHome handlers)"
  - phase: 02-live-stats-result-polish
    plan: "02-01"
    provides: "StatsBar Framer Motion fade-in, framer-motion installed"
  - phase: 02-live-stats-result-polish
    plan: "02-02"
    provides: "ResultOverlay with useCountUp count-up animations"
provides:
  - "AnimatePresence mode=wait wrapping all three screens with 200ms opacity fade transitions"
  - "Retry increments testKey counter to force TestScreen remount (new word list, same difficulty)"
  - "Home resets difficulty to null (unselected buttons) and clears result state"
  - "screenVariants + screenTransition const defined at module level per CLAUDE.md rule"
affects:
  - 03-sound-framer-motion-final

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AnimatePresence mode=wait: exit animation completes before entry animation starts (sequential fade)"
    - "Stable key per screen (home/test/result) on motion.div; inner key={testKey} on TestScreen for remount without motion key change"
    - "Counter state (testKey) pattern for forcing remount of child component without affecting parent motion.div key"

key-files:
  created: []
  modified:
    - components/TypingApp.tsx

key-decisions:
  - "mode=wait on AnimatePresence: ensures 200ms exit completes before 200ms entry starts — both actions feel equivalent weight"
  - "testKey counter on inner TestScreen (not outer motion.div): remounts only TestScreen for new word list without triggering motion.div exit/enter"
  - "style={{ width: '100%', height: '100%' }} on motion.div: prevents layout disruption, screens handle own centering"

patterns-established:
  - "AnimatePresence pattern: wrap conditional renders with unique stable keys, not the condition itself"

requirements-completed: [R-029, R-033, R-034]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 2 Plan 03: AnimatePresence Screen Transitions Summary

**Framer Motion AnimatePresence mode=wait wrapping all screens with 200ms opacity fades; Retry forces TestScreen remount for new word list via testKey counter; Home resets difficulty to null**

## Status: STOPPED AT CHECKPOINT — Awaiting human verification

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-05T14:27:46Z
- **Completed:** 2026-03-05T14:28:52Z (Task 1 only; Task 2 is human-verify checkpoint)
- **Tasks:** 1 of 2 complete (Task 2 is human-verify checkpoint)
- **Files modified:** 1

## Accomplishments

- Restructured TypingApp.tsx return from conditional if/return to single AnimatePresence wrapper
- All screens (home/test/result/fallback) wrapped in motion.div with unique stable keys
- screenVariants (initial/animate/exit opacity) and screenTransition (200ms) defined as const at module top
- testKey useState counter added; handleRetry increments it to force TestScreen remount for fresh word list
- handleHome unchanged — already calls setDifficulty(null) and setResult(null)
- Build passes, all 14 unit tests pass, all 3 axe-core screens pass with zero violations

## Task Commits

1. **Task 1: AnimatePresence screen transitions + Retry/Home wiring** - `ed93b4e` (feat)

**Task 2:** Human verification checkpoint — not yet approved.

## Files Created/Modified

- `components/TypingApp.tsx` - Added AnimatePresence, motion imports; screenVariants/screenTransition consts; testKey state; restructured render to AnimatePresence with motion.div per screen

## Decisions Made

- mode="wait" on AnimatePresence required — ensures exit completes before entry (sequential 200ms fade, not simultaneous)
- testKey counter on inner `<TestScreen key={testKey}>` not outer motion.div key — forces TestScreen remount for new word list without triggering motion.div exit/enter animation cycle
- width/height 100% on motion.div — screens already handle own centering, motion.div must not constrain layout

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- AnimatePresence screen transitions complete
- All automated verification passes (build, unit tests, axe-core)
- Awaiting human browser verification (Task 2 checkpoint) before Phase 2 is marked fully complete

## Self-Check: PASSED

- FOUND: components/TypingApp.tsx
- FOUND commit ed93b4e (Task 1: AnimatePresence screen transitions)
- `npm run build`: exits 0, no TypeScript errors
- `npm test`: 14/14 tests pass
- `npx playwright test e2e/a11y.spec.ts`: 3/3 pass, zero violations

---
*Phase: 02-live-stats-result-polish*
*Completed: 2026-03-05 (partial — checkpoint pending)*
