---
phase: 01-foundation-core-typing-engine
plan: "04"
subsystem: ui
tags: [react, typescript, css-modules, aria, accessibility, memo]

# Dependency graph
requires:
  - phase: 01-foundation-core-typing-engine
    plan: "01"
    provides: "types/index.ts with Difficulty, Word, Char, CharState, WordState types"
provides:
  - DifficultySelector component with role=radiogroup, roving tabindex, arrow key navigation
  - StatsBar component with opacity-based visibility, WPM/TIME/ACC display slots
  - TextDisplay component with memoized WordSpan and CharSpan, cursor blink animation
affects:
  - "01-05 HomeScreen uses DifficultySelector"
  - "01-05 TestScreen uses StatsBar and TextDisplay"
  - "01-06 TypingApp.tsx integrates all display components"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - React.memo on inner-loop components to prevent re-renders on every keypress
    - opacity:0 instead of display:none to preserve layout height (StatsBar)
    - role=radiogroup + role=radio + aria-checked ARIA pattern for keyboard-accessible custom selects
    - Roving tabindex: only selected/first option gets tabIndex=0, rest get tabIndex=-1
    - CSS @keyframes step-end for cursor blink (no JavaScript timer needed)

key-files:
  created:
    - components/DifficultySelector/index.tsx
    - components/DifficultySelector/DifficultySelector.module.css
    - components/StatsBar/index.tsx
    - components/StatsBar/StatsBar.module.css
    - components/TextDisplay/index.tsx
    - components/TextDisplay/TextDisplay.module.css
  modified: []

key-decisions:
  - "React.memo on CharSpan and WordSpan: prevents re-rendering the entire word list on every keypress — only the active word and changed word re-render"
  - "opacity:0 / opacity:1 toggle for StatsBar (not display:none): CLAUDE.md requires height always reserved so layout does not shift when stats become visible"
  - "CSS blink animation uses step-end timing function: produces crisp on/off blink consistent with terminal aesthetic, no easing"
  - "Cursor rendered as border-left on current char span (not a separate element): eliminates layout shift issues and simplifies cursor tracking"

patterns-established:
  - "Memoized inner components: wrap char-level and word-level spans in React.memo for typing-intensive UIs"
  - "Opacity toggle pattern: use inline style opacity + pointerEvents for hidden-but-space-reserving UI elements"
  - "ARIA radiogroup pattern: role=radiogroup container, role=radio options, aria-checked, roving tabindex"

requirements-completed: [R-001, R-002, R-006, R-007, R-070, R-075]

# Metrics
duration: 2min
completed: 2026-03-04
---

# Phase 1 Plan 04: Display Components (DifficultySelector, StatsBar, TextDisplay) Summary

**Three display-layer UI components: ARIA-compliant radiogroup difficulty picker, opacity-toggled stats bar with WPM/TIME/ACC slots, and memoized character-level text renderer with CSS cursor blink**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-04T13:50:29Z
- **Completed:** 2026-03-04T13:52:30Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- DifficultySelector with full ARIA radiogroup semantics, roving tabindex, and arrow key + Enter/Space navigation
- StatsBar with opacity-based visibility (never display:none), three labeled slots for WPM/TIME/ACC
- TextDisplay with React.memo on CharSpan and WordSpan, all four char states, blinking cursor, active word border, wrong word tint

## Task Commits

Each task was committed atomically:

1. **Task 1: DifficultySelector component with ARIA radiogroup** - `eb1ed34` (feat)
2. **Task 2: StatsBar and TextDisplay components** - `f64b4bd` (feat)

## Files Created/Modified
- `components/DifficultySelector/index.tsx` - ARIA radiogroup difficulty picker with keyboard navigation and roving tabindex
- `components/DifficultySelector/DifficultySelector.module.css` - default/hover/selected/focus-visible visual states
- `components/StatsBar/index.tsx` - WPM/TIME/ACC stats display with opacity-based show/hide
- `components/StatsBar/StatsBar.module.css` - three-slot layout, label/value typography classes
- `components/TextDisplay/index.tsx` - memoized CharSpan + WordSpan with cursor position tracking
- `components/TextDisplay/TextDisplay.module.css` - char state classes, @keyframes blink, active word and wrong word styles

## Decisions Made
- React.memo on CharSpan and WordSpan: prevents re-rendering the entire word list on every keypress. Only the active word and the word that just changed will re-render, making the typing experience smooth even with 80+ words rendered.
- opacity:0 / opacity:1 toggle for StatsBar instead of display:none: CLAUDE.md architecture rule states height must always be reserved so no layout shift occurs when stats become visible on first keypress.
- CSS blink animation uses step-end timing: produces crisp on/off blink consistent with terminal aesthetic, no easing needed.
- Cursor as border-left on current char span (not a separate element): eliminates layout shift and simplifies cursor position tracking.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DifficultySelector, StatsBar, TextDisplay all ready for use in HomeScreen and TestScreen (Plan 05)
- All components export named exports matching the build order in CLAUDE.md
- TypeScript strict mode: zero errors
- No blockers

## Self-Check: PASSED

All files verified on disk and commits confirmed in git log.

---
*Phase: 01-foundation-core-typing-engine*
*Completed: 2026-03-04*
