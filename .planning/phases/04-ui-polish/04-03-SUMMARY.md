---
phase: 04-ui-polish
plan: 03
subsystem: ui
tags: [react, css-modules, css-grid, vitest, testing-library, framer-motion]

# Dependency graph
requires:
  - phase: 03-sounds-edge-cases-animations-a11y
    provides: TestScreen with quit modal, StatsBar with Framer Motion, useKeystrokeSound hook
provides:
  - TestScreen without sound toggle (sound always on), with bordered amber container
  - StatsBar redesigned as 3-column CSS grid with column dividers and tabular-nums
  - 19 unit tests covering StatsBar and TestScreen behavior
affects: [04-04-PLAN.md, any future TestScreen or StatsBar modifications]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS grid 1fr/1fr/1fr for equal-column stat bars with border dividers
    - opacity:0 + pointer-events:none for hidden state (never display:none)
    - font-variant-numeric:tabular-nums + min-width on stat values to prevent layout shift
    - Framer Motion animate prop drives opacity transition from 0 to 1 on started prop

key-files:
  created:
    - components/StatsBar/StatsBar.test.tsx
    - components/TestScreen/TestScreen.test.tsx
  modified:
    - components/TestScreen/index.tsx
    - components/TestScreen/TestScreen.module.css
    - components/StatsBar/index.tsx
    - components/StatsBar/StatsBar.module.css

key-decisions:
  - "Sound toggle button fully removed — sound always on, no user opt-out in test screen"
  - "timeWarning prop retained on StatsBar (computed in TestScreen) rather than computing timeLeft <= 10 inside StatsBar — keeps component pure/testable"
  - "Framer Motion motion.div retained for StatsBar opacity transition — already installed, provides smooth reveal on first keypress"
  - "Test files use vi.mock for framer-motion, generateText, hooks — full isolation of TestScreen and StatsBar"

patterns-established:
  - "Bordered container pattern: max-width 900px, amber-dim border, surface background, padding:0 with internal sections adding their own padding"
  - "Stats grid pattern: CSS grid 1fr/1fr/1fr, middle column left+right border, labels in Press Start 2P 8px, values in VT323 48px"

requirements-completed: [R-020, R-021, R-022, R-023, R-024, R-040, R-041]

# Metrics
duration: 8min
completed: 2026-03-07
---

# Phase 4 Plan 03: TestScreen Container + StatsBar Grid Redesign Summary

**TestScreen with amber-bordered 900px container and StatsBar redesigned as 3-column CSS grid with dividers, tabular-nums, and Framer Motion opacity reveal — 19 tests all passing**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-07T08:02:33Z
- **Completed:** 2026-03-07T08:10:21Z
- **Tasks:** 3
- **Files modified:** 6 (4 implementation, 2 test files created)

## Accomplishments

- Sound toggle button removed from TestScreen — `useKeystrokeSound` still called, `playCorrect`/`playIncorrect` still fire on every keypress
- Bordered container div wraps all TestScreen content: max-width 900px, amber-dim 1px border, surface background, data-testid="test-container"
- StatsBar CSS changed from flexbox to CSS grid (1fr 1fr 1fr) with border dividers on middle column and Framer Motion opacity transition
- All stat values use `font-variant-numeric: tabular-nums` and `min-width: 80px` to prevent layout shift as WPM/TIME/ACC update
- 19 unit tests written and passing for StatsBar (13) and TestScreen (6)

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove sound toggle from TestScreen, add bordered container** - `62cb8a0` (feat)
2. **Task 2: Redesign StatsBar as 3-column CSS grid** - `f0bb691` (feat)
3. **Task 3: Write StatsBar and TestScreen tests** - `00e90d8` (test)

## Files Created/Modified

- `components/TestScreen/index.tsx` - Removed soundEnabled state + toggle button; added data-testid="test-screen", data-testid="test-container" on container div, data-testid="text-display" on TextDisplay wrapper
- `components/TestScreen/TestScreen.module.css` - Added .container (max-width:900px, amber-dim border, surface bg), .textDisplayContainer (padding:32px 40px), .escapeHint (border-top divider)
- `components/StatsBar/index.tsx` - Maintained 3-column structure with data-testid attributes; Framer Motion opacity animation on started prop; timeWarning drives red color on TIME
- `components/StatsBar/StatsBar.module.css` - CSS grid (1fr 1fr 1fr), .colMiddle border dividers, .value classes with tabular-nums + min-width, timePulse animation at reduced motion safe
- `components/StatsBar/StatsBar.test.tsx` - 13 tests: testids, label text, WPM/TIME/ACC values, accuracy null/number, no sound text
- `components/TestScreen/TestScreen.test.tsx` - 6 tests: container structure, testids, no sound toggle, ESC hint

## Decisions Made

- Sound toggle button fully removed — sound always on (no user opt-out in test screen)
- `timeWarning` prop retained on StatsBar (computed as `timeLeft <= 10 && started && timeLeft > 0` in TestScreen) rather than computing inside StatsBar — keeps component pure and independently testable
- Framer Motion `motion.div` retained for StatsBar — already installed, provides smooth opacity reveal on first keypress without display:none
- Test mocks use `vi.mock` for framer-motion (replaces motion.div with plain div), all hooks, and child components — full isolation

## Deviations from Plan

None - plan executed exactly as written. Implementation was already partially complete from earlier phase work; all changes committed cleanly.

## Issues Encountered

None - TypeScript clean throughout, all 19 tests pass on first run.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- TestScreen and StatsBar fully polished with bordered container and grid stats
- All data-testid attributes present for future Playwright e2e tests
- Ready for Phase 04-04 (remaining UI polish tasks)

---
*Phase: 04-ui-polish*
*Completed: 2026-03-07*
