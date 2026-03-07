---
phase: 04-ui-polish
plan: 02
subsystem: ui
tags: [framer-motion, css-modules, a11y, radiogroup, vitest]

# Dependency graph
requires:
  - phase: 03-sounds-edge-cases-animations-a11y
    provides: DifficultySelector with motion.div radiogroup, HomeScreen with DifficultySelector
provides:
  - DifficultySelector horizontal pixel-art cards with amber selected state and motion.button
  - HomeScreen data-testid attributes for testability
  - DifficultySelector unit tests (7 tests, all passing)
affects: [04-03-ui-polish, 04-04-ui-polish, HomeScreen integration tests]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "motion.button preferred over motion.div for interactive radio-like cards (keyboard, click, type=button)"
    - "value prop naming for controlled selector components (not selected)"
    - "CSS class naming: .container/.card pattern for card-layout selectors"

key-files:
  created:
    - components/DifficultySelector/DifficultySelector.test.tsx
  modified:
    - components/DifficultySelector/index.tsx
    - components/DifficultySelector/DifficultySelector.module.css
    - components/HomeScreen/index.tsx

key-decisions:
  - "Switch from motion.div to motion.button for DifficultySelector cards — semantically correct for interactive clickable elements"
  - "Rename prop from 'selected' to 'value' per plan spec — aligns with standard controlled component convention"
  - "CSS class rename .group/.option to .container/.card — matches plan's naming scheme"
  - "Preserve keyboard navigation and useReducedMotion in refactored component — plan's simplified sample omitted these but they are required for R-075 and a11y compliance"

patterns-established:
  - "DifficultySelector: value prop (Difficulty | null), onChange callback, disabled optional"
  - "Framer Motion mock in tests: mock motion.button (not motion.div) to match component element type"

requirements-completed:
  - R-001
  - R-061
  - R-075

# Metrics
duration: 2min
completed: 2026-03-07
---

# Phase 04 Plan 02: DifficultySelector Pixel-Art Cards Summary

**DifficultySelector refactored to horizontal pixel-art cards with motion.button, amber selected state rgba(180,100,0,0.35), radiogroup a11y, and full vitest coverage**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-07T08:02:09Z
- **Completed:** 2026-03-07T08:03:34Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- DifficultySelector redesigned with `value` prop, `motion.button` elements, `.container`/`.card` CSS classes
- Horizontal flex row layout preserved; amber selected state, pixel double-border box-shadow, Framer Motion interactions confirmed
- HomeScreen updated to pass `value={selectedDifficulty}` to DifficultySelector (data-testids already present)
- 7 DifficultySelector unit tests updated and passing (mock updated to `motion.button`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign DifficultySelector as horizontal pixel-art cards** - `9f2b652` (feat)
2. **Task 2: Update HomeScreen to pass value prop** - `57acef9` (feat)
3. **Task 3: Update DifficultySelector tests** - `e6d0282` (test)

## Files Created/Modified

- `components/DifficultySelector/index.tsx` - Refactored: value prop, motion.button, .container/.card classes, preserved keyboard nav + reduced motion
- `components/DifficultySelector/DifficultySelector.module.css` - Renamed .group→.container, .option→.card
- `components/HomeScreen/index.tsx` - Changed selected= to value= prop call site
- `components/DifficultySelector/DifficultySelector.test.tsx` - Updated mock (motion.button) and prop names (value=)

## Decisions Made

- Used `motion.button` instead of `motion.div` for card elements — semantically correct for interactive elements and provides native keyboard handling
- Renamed prop from `selected` to `value` per plan spec — standard controlled component convention
- Preserved keyboard navigation (Arrow keys) and `useReducedMotion` from Phase 3 implementation — plan's code sample omitted these but they are required for R-075 accessibility compliance
- Updated Framer Motion mock in tests from `motion.div` to `motion.button` — required to match updated component

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Preserved keyboard navigation and reduced motion**
- **Found during:** Task 1 (DifficultySelector redesign)
- **Issue:** Plan's code sample was a simplified version that omitted Arrow key navigation and `useReducedMotion` hook — both are required for R-075 compliance
- **Fix:** Kept `handleContainerKeyDown` (Arrow key navigation), `useReducedMotion` integration, and `disabled` prop from Phase 3 implementation while applying all plan changes
- **Files modified:** components/DifficultySelector/index.tsx
- **Verification:** tsc --noEmit exits 0; all 59 tests pass
- **Committed in:** 9f2b652 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (missing critical a11y functionality)
**Impact on plan:** Auto-fix preserves R-075 compliance. No scope creep. All plan must_haves satisfied.

## Issues Encountered

- HomeScreen data-testids (`data-testid="home-screen"` and `data-testid="start-button"`) were already present from Phase 3 — Task 2 only needed to update the prop name from `selected` to `value`
- DifficultySelector test file already existed from Phase 4-03 plan — updated in place rather than created fresh

## Next Phase Readiness

- DifficultySelector horizontal card layout ready for 04-03 and 04-04 visual polish tasks
- All 59 tests passing, TypeScript clean
- No blockers

---
*Phase: 04-ui-polish*
*Completed: 2026-03-07*
