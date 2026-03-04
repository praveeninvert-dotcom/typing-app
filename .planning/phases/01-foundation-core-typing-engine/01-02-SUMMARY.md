---
phase: 01-foundation-core-typing-engine
plan: "02"
subsystem: hooks
tags: [react-hooks, countdown-timer, useRef, stale-closure, web-audio-stub, typescript]

# Dependency graph
requires:
  - phase: 01-foundation-core-typing-engine
    plan: "01"
    provides: lib/constants.ts (TIMER_DURATION), types/index.ts
provides:
  - hooks/useCountdown.ts (useCountdown hook returning { timeLeft, start, reset })
  - hooks/useKeystrokeSound.ts (Phase 1 stub returning { playCorrect, playIncorrect })
affects:
  - hooks/useTypingEngine.ts (consumes useCountdown start/reset callbacks)
  - components/TestScreen (calls useKeystrokeSound, useCountdown)
  - components/TypingApp.tsx (passes onComplete to useCountdown)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useRef for interval ID storage (avoids triggering re-renders on interval ID changes)
    - onCompleteRef pattern (stores callback in useRef, updated every render, prevents stale closure)
    - Functional updater form in setState for closure safety
    - Idempotency guard in start() prevents double-interval bug
    - Phase stub pattern: identical interface today, drop-in replacement in Phase 3

key-files:
  created:
    - hooks/useCountdown.ts
    - hooks/useKeystrokeSound.ts
  modified:
    - tsconfig.json (added vitest/globals to types)

key-decisions:
  - "useRef for onComplete callback instead of dependency array — prevents stale closure when onComplete identity changes across renders"
  - "Functional updater setTimeLeft(prev => ...) avoids depending on timeLeft in interval closure"
  - "useKeystrokeSound stub exports identical interface to Phase 3 implementation — TestScreen needs zero changes when Phase 3 adds real audio"
  - "Added vitest/globals to tsconfig.json types so vi/describe/it/expect are recognized by tsc in test files"

patterns-established:
  - "Ref-based callback pattern: onCompleteRef.current = callback assigned in function body (not useEffect) updates on every render"
  - "Stub hook pattern: return interface matches future real implementation exactly"

requirements-completed: [R-004, R-005, R-010]

# Metrics
duration: 8min
completed: 2026-03-04
---

# Phase 1 Plan 02: Countdown Timer Hook + Sound Stub Summary

**useRef-guarded countdown timer from TIMER_DURATION with stale-closure-safe onComplete, plus no-op sound stub matching the Phase 3 Web Audio API interface exactly**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-04T00:04:34Z
- **Completed:** 2026-03-04T00:12:34Z
- **Tasks:** 2
- **Files modified:** 3 (hooks/useCountdown.ts, hooks/useKeystrokeSound.ts, tsconfig.json)

## Accomplishments
- Implemented `useCountdown` with idempotency guard, stale-closure-safe callback, functional updater state, and clean reset
- Created `useKeystrokeSound` Phase 1 stub with no-op `playCorrect`/`playIncorrect` — zero AudioContext, identical interface to Phase 3
- Fixed pre-existing tsconfig missing vitest global types so `vi`, `describe`, `it`, `expect` resolve correctly in test files

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement useCountdown hook** - `95af7a3` (feat)
2. **Task 2: Create useKeystrokeSound stub + tsconfig vitest types** - `baf730f` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `hooks/useCountdown.ts` - Timer hook: counts down from TIMER_DURATION, start()/reset(), useRef interval guard, onCompleteRef stale-closure pattern
- `hooks/useKeystrokeSound.ts` - Phase 1 stub: no-op playCorrect/playIncorrect, no AudioContext, same return type Phase 3 will implement
- `tsconfig.json` - Added `"types": ["vitest/globals"]` so vi/describe/it/expect resolve in test files

## Decisions Made

1. **onCompleteRef pattern:** Storing onComplete in `useRef` and setting `.current = onComplete` in the function body (not useEffect) is the correct React pattern. It updates on every render without causing re-renders or stale closures in the interval.

2. **useKeystrokeSound stub interface:** The stub returns the exact same types as the Phase 3 implementation will. When Phase 3 replaces the stub with real Web Audio API, no component that calls `useKeystrokeSound` needs to change.

3. **tsconfig vitest/globals:** The test file `hooks/__tests__/useTypingEngine.test.ts` (created in Plan 01-01 as TDD RED) uses vitest globals (`vi`, `describe`, `it`, `expect`). Without `"types": ["vitest/globals"]` in tsconfig, tsc reported those names as unknown. Adding this was a Rule 2 auto-fix — missing critical type configuration for test correctness.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added vitest/globals to tsconfig.json types**
- **Found during:** Task 2 verification (`npx tsc --noEmit`)
- **Issue:** `hooks/__tests__/useTypingEngine.test.ts` (pre-existing TDD stub from Plan 01-01) used vitest globals (`vi`, `describe`, `it`, `expect`) but tsconfig had no `"types"` field. TypeScript reported ~60 errors for unknown names.
- **Fix:** Added `"types": ["vitest/globals"]` to `compilerOptions` in tsconfig.json
- **Files modified:** tsconfig.json
- **Verification:** `npx tsc --noEmit` passes with zero errors after fix
- **Committed in:** baf730f (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical configuration)
**Impact on plan:** Auto-fix necessary for TypeScript correctness. No scope creep — this was missing type configuration needed for the project's existing test files.

## Issues Encountered
None beyond the tsconfig auto-fix above.

## Next Phase Readiness
- `useCountdown` is ready for `useTypingEngine` to call `start()`/`reset()` and observe `timeLeft`
- `useKeystrokeSound` stub is ready for `TestScreen` to call without any audio side effects
- All hooks TypeScript-clean with zero errors
- Next: Plan 01-03 implements `useTypingEngine` (core typing logic, character comparison, WPM/accuracy calculation)

---
*Phase: 01-foundation-core-typing-engine*
*Completed: 2026-03-04*

## Self-Check: PASSED

| Item | Status |
|------|--------|
| hooks/useCountdown.ts exists | FOUND |
| hooks/useKeystrokeSound.ts exists | FOUND |
| .planning/phases/01-foundation-core-typing-engine/01-02-SUMMARY.md exists | FOUND |
| Commit 95af7a3 (Task 1: useCountdown) | FOUND |
| Commit baf730f (Task 2: useKeystrokeSound + tsconfig) | FOUND |
| npx tsc --noEmit passes (zero errors) | PASS |
| onCompleteRef pattern in useCountdown | PASS |
| No AudioContext in useKeystrokeSound | PASS |
