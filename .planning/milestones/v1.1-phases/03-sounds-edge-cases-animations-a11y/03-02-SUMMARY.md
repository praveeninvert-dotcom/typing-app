---
phase: 03-sounds-edge-cases-animations-a11y
plan: 02
subsystem: ui
tags: [react, typescript, accessibility, keyboard, focus-trap, aria]

# Dependency graph
requires:
  - phase: 03-sounds-edge-cases-animations-a11y
    provides: useKeystrokeSound and sound toggle already in TestScreen (03-01)
provides:
  - Caps Lock warning banner with role=alert that appears/disappears on toggle
  - Escape quit confirmation modal with timer freeze and focus trap
  - useCountdown pause/resume API for freezing timer during confirmation
  - Space/Backspace pre-start guard preventing accidental timer start
  - onQuit prop wired from TestScreen through TypingApp to handleHome
affects:
  - 03-03-PLAN
  - 03-04-PLAN (reduced motion may affect capsWarning animation)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - pausedRef gate pattern for interval-based timers (early return in tick)
    - e.getModifierState('CapsLock') on both hidden input keydown and window listener
    - Focus trap via onKeyDown on overlay div cycling refs between two buttons
    - setTimeout(..., 0) after setState for post-render focus

key-files:
  created: []
  modified:
    - hooks/useCountdown.ts
    - components/TestScreen/index.tsx
    - components/TestScreen/TestScreen.module.css
    - components/TypingApp.tsx

key-decisions:
  - "pausedRef (not state) gates the setInterval tick — avoids re-render on pause/resume, zero risk of stale value"
  - "reset() also clears pausedRef.current = false — prevents stuck-paused state on test restart"
  - "Caps Lock monitored on both hidden input (handleKeyDown) and window listeners — catches OS-level toggle outside the focused input"
  - "Focus trap implemented on quitOverlay div's onKeyDown, not on document — avoids global listener cleanup"

patterns-established:
  - "Pause gate: useRef(false) as gate for setInterval callbacks — zero re-render overhead"
  - "Focus after state update: setTimeout(() => ref.current?.focus(), 0) pattern"

requirements-completed: [R-050, R-051, R-052, R-053, R-054, R-055, R-056, R-057, R-072, R-073]

# Metrics
duration: 3min
completed: 2026-03-06
---

# Phase 03 Plan 02: Edge Cases Summary

**Caps Lock warning (role=alert), Escape quit confirmation with timer freeze, focus trap, and Space/Backspace pre-start guard using pausedRef gate in useCountdown**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-06T14:08:02Z
- **Completed:** 2026-03-06T14:10:23Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- useCountdown pause/resume API added via pausedRef gate — timer freezes on Escape, resumes on NO/Escape-dismiss
- Caps Lock detection via both hidden input keydown and window listeners; warning banner with role=alert
- Quit confirmation modal with ARIA dialog, focus trap (Tab cycles YES/NO only), and Escape-to-dismiss
- Space and Backspace silently ignored before first character (R-057)
- TypingApp.tsx passes `onQuit={handleHome}` to TestScreen; all 10 requirements satisfied

## Task Commits

Each task was committed atomically:

1. **Task 1: Add pause/resume to useCountdown** - `92dd94a` (feat)
2. **Task 2: Caps Lock warning + Escape quit confirmation + TypingApp wiring + CSS** - `69cd6d8` (feat)

## Files Created/Modified
- `hooks/useCountdown.ts` - Added pausedRef, pause(), resume() to UseCountdownReturn; pause clears in reset()
- `components/TestScreen/index.tsx` - Added capsLockOn state, quitting state, Escape handler, quit overlay JSX, caps warning JSX, window listener effect, onQuit prop
- `components/TestScreen/TestScreen.module.css` - Added capsWarning, quitOverlay, quitModal, quitTitle, quitButtons, quitButton styles
- `components/TypingApp.tsx` - Added onQuit={handleHome} prop to TestScreen render

## Decisions Made
- pausedRef (not useState) gates the setInterval tick — avoids re-render overhead on pause/resume
- reset() clears pausedRef to prevent stuck-paused on test restart
- Caps Lock monitored on both the hidden input and window to catch OS-level toggles
- Focus trap on quitOverlay onKeyDown (not document) — simpler lifecycle, no manual removeEventListener needed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TestScreen had been modified by 03-01 (sound toggle) before this plan ran**
- **Found during:** Task 2 (reading TestScreen before writing)
- **Issue:** The plan's file list showed the pre-03-01 version; actual file had soundEnabled state and useKeystrokeSound({ soundEnabled }) from 03-01 already applied
- **Fix:** Integrated 03-02 changes on top of 03-01's existing code rather than overwriting it
- **Files modified:** components/TestScreen/index.tsx
- **Verification:** npx tsc --noEmit passes, npm run build succeeds
- **Committed in:** 69cd6d8 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — file state mismatch between plan and reality)
**Impact on plan:** Integration required care to preserve 03-01 sound work; no scope creep.

## Issues Encountered
- TestScreen.module.css also reflected 03-01 additions (`.sndToggle`, `position: relative` on `.screen`) — incorporated cleanly without conflict.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 10 edge case requirements satisfied (R-050 through R-057, R-072, R-073)
- useCountdown pause/resume available for any future timer-freeze needs
- Caps Lock and quit modal are visually unstyled for animation (plan 04 handles reduced motion for capsWarning)
- TestScreen props interface is stable for Phase 3 remaining plans

---
*Phase: 03-sounds-edge-cases-animations-a11y*
*Completed: 2026-03-06*
