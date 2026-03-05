---
phase: 02-live-stats-result-polish
plan: "01"
subsystem: ui
tags: [framer-motion, animation, stats, countdown, css-modules]

# Dependency graph
requires:
  - phase: 01-foundation-core-typing-engine
    provides: "useTypingEngine (correctChars, totalTypedChars, started, finished), useCountdown (timeLeft, start), StatsBar component skeleton"
provides:
  - "StatsBar animates in (fade + slide-down 8px, 200ms) on first keypress via Framer Motion"
  - "WPM displays 0 for first 5 seconds, then switches to live correctChars formula"
  - "TIME slot turns red and pulses (1s scale 1.08) when timeLeft <= 10 and test is active"
  - "timeWarning prop wired from TestScreen to StatsBar"
affects:
  - 02-live-stats-result-polish
  - 03-audio-polish-deployment

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Framer Motion motion.div with animate prop driven by boolean started prop (opacity + y translation)"
    - "5-second WPM guard: elapsedSeconds >= 5 condition before computing live WPM"
    - "CSS @keyframes timePulse combined with conditional class application for time warning"

key-files:
  created: []
  modified:
    - components/TestScreen/index.tsx
    - components/StatsBar/index.tsx
    - components/StatsBar/StatsBar.module.css

key-decisions:
  - "5-second WPM guard uses >= 5 (not > 0) — suppresses early WPM spikes when user types a burst in the first few seconds"
  - "timeWarning condition: engine.started && countdown.timeLeft <= 10 && countdown.timeLeft > 0 — stops pulse when test ends at exactly 0"
  - "Framer Motion motion.div replaces plain div for StatsBar — initial y:-8 keeps element in flow (no layout shift), animate drives visibility"

patterns-established:
  - "Boolean prop drives Framer Motion animate object — clean pattern for conditional entrance animations"
  - "Conditional CSS module class concatenation for state-driven styles: timeWarning ? styles.valueRed : styles.valueBlue"

requirements-completed: [R-020, R-021, R-022, R-023, R-024]

# Metrics
duration: 1min
completed: 2026-03-05
---

# Phase 2 Plan 01: Live Stats + StatsBar Animation Summary

**Framer Motion fade+slide entrance for StatsBar on first keypress, 5-second WPM guard to suppress early spikes, and TIME pulse animation at 10-second warning**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-05T14:23:18Z
- **Completed:** 2026-03-05T14:24:30Z
- **Tasks:** 1
- **Files modified:** 3

## Accomplishments
- StatsBar now animates in with a 200ms fade + 8px slide-down on first keypress using Framer Motion (replaces static opacity toggle)
- WPM displays 0 for the first 5 elapsed seconds, then shows live formula — eliminates misleading spikes when typing fast early
- TIME value turns red and scales (1.0 -> 1.08) in a 1-second loop when timeLeft reaches 10 or below, stops at 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Live WPM 5-second guard + StatsBar Framer Motion fade-in** - `fd93214` (feat)

## Files Created/Modified
- `components/TestScreen/index.tsx` - Changed `> 0` to `>= 5` in WPM guard; added timeWarning computed const; passed timeWarning prop to StatsBar
- `components/StatsBar/index.tsx` - Added `motion` import from framer-motion; replaced outer div with motion.div using initial/animate/transition; added timeWarning to props interface and JSX
- `components/StatsBar/StatsBar.module.css` - Added .valueRed class and @keyframes timePulse with .timePulse class

## Decisions Made
- 5-second WPM guard uses `>= 5` not `> 0` — per 02-CONTEXT.md user decision to avoid misleading WPM values in the first 5 seconds
- timeWarning stops pulsing at timeLeft === 0 (condition includes `> 0`) — test is over at 0, no need to pulse
- Framer Motion replaces the inline style opacity toggle — provides smoother entrance animation while maintaining height reservation via initial={{ opacity: 0, y: -8 }}

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- Live stats fully wired: WPM, accuracy, and countdown display correctly during test
- StatsBar entrance animation ready for QA verification
- TIME warning ready for QA verification at 10-second mark
- Plan 02 (ResultOverlay count-up animations) can proceed

## Self-Check: PASSED
- components/TestScreen/index.tsx: FOUND
- components/StatsBar/index.tsx: FOUND
- components/StatsBar/StatsBar.module.css: FOUND
- Commit fd93214: FOUND
- `npm run build`: exits 0, no TypeScript errors
- `npm test`: 14/14 tests pass

---
*Phase: 02-live-stats-result-polish*
*Completed: 2026-03-05*
