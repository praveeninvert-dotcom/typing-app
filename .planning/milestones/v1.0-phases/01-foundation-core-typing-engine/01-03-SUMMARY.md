---
phase: 01-foundation-core-typing-engine
plan: "03"
subsystem: typing-engine
tags: [react, typescript, vitest, tdd, useReducer, typing-state, hooks]

requires:
  - phase: 01-foundation-core-typing-engine
    plan: "01"
    provides:
      - types/index.ts (Word, Char, CharState types used directly)
      - lib/generateText.ts (generates Word[] fixture in tests)

provides:
  - hooks/useTypingEngine.ts (useTypingEngine hook + calculateWPM + calculateAccuracy)
  - hooks/__tests__/useTypingEngine.test.ts (14 tests: 10 hook + 4 utility formula tests)

affects:
  - 01-04 (TestScreen, TypingApp.tsx will import useTypingEngine)
  - components/TestScreen
  - components/TypingApp.tsx

tech-stack:
  added: []
  patterns:
    - "useReducer for atomic multi-field state updates in React hooks (avoids stale closures)"
    - "TDD RED-GREEN cycle: failing tests committed before implementation"
    - "Pure utility functions (calculateWPM, calculateAccuracy) exported alongside hook"
    - "Side-effect callbacks (onStart, onFinish) called from handleKey outside dispatch"

key-files:
  created:
    - hooks/useTypingEngine.ts
    - hooks/__tests__/useTypingEngine.test.ts
  modified: []

key-decisions:
  - "Used useReducer (not multiple useState) to atomically update all state fields in handleKey — avoids stale closure bugs where currentCharIndex inside a useCallback would see stale values"
  - "onStart/onFinish side effects called outside dispatch, using pre-dispatch state values to determine eligibility — cleanly separates reducer from side-effects"
  - "calculateWPM and calculateAccuracy exported as standalone pure functions, enabling direct unit testing without renderHook overhead"

patterns-established:
  - "useReducer for typing state: all state mutations go through engineReducer actions (PRINTABLE_KEY, SPACE, BACKSPACE)"
  - "Guard clauses first: finished/started checks at top of each action branch"
  - "Backspace boundary guard: if currentCharIndex === 0, return state unchanged (no word boundary crossing)"

requirements-completed: [R-004, R-006, R-007, R-008, R-009, R-011]

duration: 2min
completed: 2026-03-04
---

# Phase 1 Plan 03: useTypingEngine — Core Typing State Machine Summary

**useReducer-based typing state machine with handleKey dispatcher handling all 5 input cases (printable char, space, backspace, ignored keys, finished guard), with calculateWPM and calculateAccuracy as exported pure functions — all 14 tests passing.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-04T13:44:38Z
- **Completed:** 2026-03-04T13:47:13Z
- **Tasks:** 2 (RED phase + GREEN phase)
- **Files modified:** 2 (created)

## Accomplishments

- TDD RED phase: 14 test cases written covering all specified handleKey behaviors before any implementation
- TDD GREEN phase: `useTypingEngine` hook implemented with `useReducer` pattern — all 14 tests pass
- `calculateWPM` and `calculateAccuracy` exported as pure utility functions with dedicated unit tests
- Zero TypeScript errors (`npx tsc --noEmit` clean)

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Write failing tests** - `32d4b65` (test)
2. **Task 2 (GREEN): Implement useTypingEngine** - `61dd363` (feat)

_Note: TDD plan — RED commit before GREEN commit, with auto-fix to test file included in GREEN commit._

## Files Created/Modified

- `hooks/useTypingEngine.ts` — `useTypingEngine` hook (useReducer, handleKey dispatcher, onStart/onFinish callbacks, guard clauses) + exported `calculateWPM` and `calculateAccuracy` pure functions
- `hooks/__tests__/useTypingEngine.test.ts` — 14 tests: initial state, correct/incorrect char, backspace, backspace-boundary, space-before-start, space-advance, first-key-starts, word-finish, input-after-finish, WPM formula, accuracy formula

## Decisions Made

1. **useReducer over multiple useState:** `handleKey` needs to read and conditionally update 8 state fields atomically. Multiple `useState` calls inside `useCallback` would capture stale closure values. `useReducer` solves this — the reducer always sees the latest state when called.

2. **Side effects outside dispatch:** `onStart()` and `onFinish()` are side effects that cannot live inside the reducer (reducers must be pure). They are called from `handleKey` using pre-dispatch state values to determine eligibility. This is the standard React pattern for reducer-with-side-effects.

3. **Exported utility functions:** `calculateWPM` and `calculateAccuracy` exported at module level so they can be imported by StatsBar and ResultOverlay without re-deriving the formula. Also allows direct unit testing without `renderHook` overhead.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed require() calls in ESM test file**
- **Found during:** GREEN phase (running tests)
- **Issue:** The test file used ES module `import` at top but used `require('../useTypingEngine')` inside the `calculateWPM` and `calculateAccuracy` tests — these failed with "Cannot find module" in Vitest's ESM mode
- **Fix:** Changed the 4 helper tests to use the ES module imports already declared at the top of the file (`calculateWPM`, `calculateAccuracy` added to the import line from `../useTypingEngine`)
- **Files modified:** `hooks/__tests__/useTypingEngine.test.ts`
- **Verification:** All 14 tests pass after fix
- **Committed in:** `61dd363` (GREEN phase commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Minimal — test file import style corrected. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviation above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `useTypingEngine` is fully implemented and tested
- Ready for wiring into `TestScreen` component (plan 05+)
- `useCountdown` hook from plan 02 + `useTypingEngine` from this plan are the two hooks needed by `TestScreen`
- Both `onStart` (to trigger countdown) and `onFinish` (to transition to result) callback contracts are defined

---
*Phase: 01-foundation-core-typing-engine*
*Completed: 2026-03-04*

## Self-Check: PASSED

| Item | Status |
|------|--------|
| hooks/useTypingEngine.ts exists | FOUND |
| hooks/__tests__/useTypingEngine.test.ts exists | FOUND |
| .planning/phases/01-foundation-core-typing-engine/01-03-SUMMARY.md exists | FOUND |
| Commit 32d4b65 (RED phase) | FOUND |
| Commit 61dd363 (GREEN phase) | FOUND |
| All 14 tests pass | PASS |
| `npx tsc --noEmit` clean | PASS |
