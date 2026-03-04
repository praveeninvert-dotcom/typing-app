---
phase: 01-foundation-core-typing-engine
plan: "06"
subsystem: ui
tags: [next.js, css-custom-properties, crt-overlay, fonts, accessibility, axe-core, playwright]

# Dependency graph
requires:
  - phase: 01-04
    provides: "All components built (DifficultySelector, StatsBar, TextDisplay, ResultOverlay, HomeScreen, TestScreen, TypingApp)"
  - phase: 01-05
    provides: "Full typing test loop assembled and functional"
provides:
  - "app/globals.css: Tailwind base, 9 CSS custom properties, CRT scanlines + vignette"
  - "app/layout.tsx: Press Start 2P + VT323 fonts loaded via next/font/google"
  - "app/page.tsx: root page renders TypingApp"
  - "e2e/a11y.spec.ts: axe-core passes on all three screens"
  - "DifficultySelector: aria-label on each radio option"
  - "ResultOverlay: role=dialog + aria-modal + aria-labelledby"
  - "TestScreen: main landmark + sr-only h1"
affects: [phase-02, phase-03]

# Tech tracking
tech-stack:
  added: ["@axe-core/playwright (E2E axe accessibility scans)"]
  patterns:
    - "CSS custom properties in :root for full color palette"
    - "CRT overlay via body::before (vignette) and body::after (scanlines)"
    - "next/font/google with weight and variable for non-variable fonts"
    - "sr-only CSS pattern for visually-hidden but screen-reader-accessible content"
    - "role=dialog + aria-modal + aria-labelledby for modal accessibility"

key-files:
  created:
    - app/globals.css
    - app/layout.tsx
    - app/page.tsx
    - e2e/a11y.spec.ts
  modified:
    - components/DifficultySelector/index.tsx
    - components/ResultOverlay/index.tsx
    - components/TestScreen/index.tsx
    - components/TestScreen/TestScreen.module.css
    - vitest.config.ts

key-decisions:
  - "TestScreen root element changed from div to main — satisfies axe-core landmark-one-main requirement"
  - "sr-only h1 added to TestScreen — satisfies axe-core page-has-heading-one requirement"
  - "ResultOverlay modal gets role=dialog + aria-modal + aria-labelledby — satisfies region landmark requirement"
  - "DifficultySelector radio options get aria-label={diff.label} — enables aria-label selector in Playwright tests"
  - "vitest.config.ts exclude e2e/** — prevents Playwright spec files from being picked up by Vitest runner"
  - "eslint-disable comment in TestScreen changed from @typescript-eslint/no-unused-vars to no-unused-vars — plugin not installed"

patterns-established:
  - "axe-core scan with color-contrast disabled (intentional: --color-text-dim is non-interactive untyped text)"
  - "NEXT_PUBLIC_TEST_TIMER_DURATION=3 in playwright.config.ts webServer — ResultScreen reachable in 4s for E2E tests"

requirements-completed: [R-070, R-071, R-075, R-076]

# Metrics
duration: 5min
completed: 2026-03-04
---

# Phase 1 Plan 06: App Shell + Accessibility Summary

**Next.js 14 app shell wired up with retro CSS variables, Google fonts, CRT overlay, and axe-core passing zero violations on all three screens**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-04T14:00:18Z
- **Completed:** 2026-03-04T14:05:18Z
- **Tasks:** 2 auto tasks (+ checkpoint task)
- **Files modified:** 9

## Accomplishments
- globals.css: full retro color palette (9 CSS custom properties), CRT scanlines via body::after, CRT vignette via body::before, Tailwind directives
- layout.tsx: Press Start 2P and VT323 loaded as CSS variable fonts, TYPING.EXE metadata
- page.tsx: root page renders TypingApp (server component wrapper)
- axe-core passes zero violations on HomeScreen, TestScreen, and ResultScreen (color-contrast excluded intentionally)
- ResultScreen test reaches result by typing one character then waiting 4s (3s timer + 1s buffer via NEXT_PUBLIC_TEST_TIMER_DURATION=3)
- All 14 Vitest unit tests still pass after changes
- Phase 1 human-verified and approved: full typing test loop works end-to-end in browser

## Task Commits

Each task was committed atomically:

1. **Task 1: App shell — globals.css, layout.tsx, page.tsx** - `ca1b2b7` (feat)
2. **Task 2: axe-core Playwright accessibility tests** - `16c1b6e` (feat)
3. **Task 3: useTypingEngine end-of-word guard (found during checkpoint verification)** - `f5a95bd` (fix)

**Plan metadata:** `04e3421` (docs: complete app shell and axe-core accessibility plan — prior to checkpoint)
**Post-checkpoint metadata:** `89c326e` (docs: complete app shell and axe-core accessibility plan — post-checkpoint)

## Files Created/Modified
- `app/globals.css` - Tailwind directives, 9 CSS custom properties, CRT scanlines + vignette, retro focus/button reset
- `app/layout.tsx` - Press Start 2P + VT323 fonts via next/font/google, TYPING.EXE metadata, font variables on html element
- `app/page.tsx` - Root page: renders TypingApp only
- `e2e/a11y.spec.ts` - axe-core tests for HomeScreen, TestScreen, ResultScreen (ResultScreen via 3s timer + 4s wait)
- `components/DifficultySelector/index.tsx` - Added aria-label={diff.label} to each radio option
- `components/ResultOverlay/index.tsx` - Added role="dialog", aria-modal="true", aria-labelledby="result-header" to modal; added id to h1
- `components/TestScreen/index.tsx` - Changed root div to main; added sr-only h1; fixed eslint-disable comment
- `components/TestScreen/TestScreen.module.css` - Added .srOnly class (visually-hidden pattern)
- `vitest.config.ts` - Added exclude: ['**/e2e/**'] to prevent Playwright specs from running in Vitest
- `hooks/useTypingEngine.ts` - Added guard `if (currentCharIndex >= word.chars.length) return state` in PRINTABLE_KEY case

## Decisions Made
- TestScreen changed from div to main landmark — axe-core requires a main landmark; matches semantic intent (it IS the main content)
- sr-only h1 "Typing Test — Active" added to TestScreen — axe-core requires a page-level h1; visually hidden keeps retro aesthetic
- ResultOverlay modal wraps with role=dialog + aria-modal — correct ARIA pattern for modal dialogs, fixes region violation by creating dialog landmark
- DifficultySelector radio items get aria-label — enables both Playwright selectors and improves screen reader experience
- color-contrast intentionally excluded from all axe scans — --color-text-dim (#444444 on #0a0a0a = ~1.8:1) is non-interactive untyped text, documented per ACCESSIBILITY-STANDARDS.md

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] DifficultySelector missing aria-label on radio options**
- **Found during:** Task 2 (axe-core TestScreen test timeout)
- **Issue:** TestScreen test used selector `[role="radio"][aria-label*="EASY"]` — timed out because radio divs had no aria-label attribute
- **Fix:** Added `aria-label={diff.label}` to each radio option div in DifficultySelector
- **Files modified:** `components/DifficultySelector/index.tsx`
- **Verification:** TestScreen axe-core test passes; selector resolves immediately
- **Committed in:** `16c1b6e` (Task 2 commit)

**2. [Rule 1 - Bug] ResultOverlay content outside landmark (axe region violation)**
- **Found during:** Task 2 (ResultScreen axe-core scan)
- **Issue:** axe-core flagged `region` violation — h1, stat groups, breakdown, buttons all outside any landmark
- **Fix:** Added `role="dialog"` + `aria-modal="true"` + `aria-labelledby="result-header"` to modal div; added `id="result-header"` to h1
- **Files modified:** `components/ResultOverlay/index.tsx`
- **Verification:** ResultScreen axe-core test passes with zero violations
- **Committed in:** `16c1b6e` (Task 2 commit)

**3. [Rule 1 - Bug] TestScreen missing main landmark and page h1 (axe violations)**
- **Found during:** Task 2 (TestScreen axe-core scan — landmark-one-main, page-has-heading-one, region violations)
- **Issue:** TestScreen root was a div — no main landmark, no h1, content outside regions
- **Fix:** Changed root div to main; added visually-hidden h1 "Typing Test — Active"; added .srOnly CSS class
- **Files modified:** `components/TestScreen/index.tsx`, `components/TestScreen/TestScreen.module.css`
- **Verification:** TestScreen axe-core test passes with zero violations
- **Committed in:** `16c1b6e` (Task 2 commit)

**4. [Rule 3 - Blocking] eslint-disable comment used unavailable @typescript-eslint rule**
- **Found during:** Task 1 (npm run build — ESLint error)
- **Issue:** TestScreen had `// eslint-disable-next-line @typescript-eslint/no-unused-vars` but `@typescript-eslint/eslint-plugin` is not installed
- **Fix:** Changed comment to `no-unused-vars` (standard rule) and prefixed unused destructured vars with underscore
- **Files modified:** `components/TestScreen/index.tsx`
- **Verification:** `npm run build` exits 0
- **Committed in:** `ca1b2b7` (Task 1 commit)

**5. [Rule 3 - Blocking] Vitest picked up Playwright e2e spec files**
- **Found during:** Task 2 (npm test after creating e2e/a11y.spec.ts)
- **Issue:** vitest.config.ts had no exclude pattern — Playwright spec matched `*.spec.ts` and failed with "Playwright Test did not expect test.describe() to be called here"
- **Fix:** Added `exclude: ['**/node_modules/**', '**/e2e/**']` to vitest test config
- **Files modified:** `vitest.config.ts`
- **Verification:** `npm test` runs 14 unit tests, passes, e2e files not included
- **Committed in:** `16c1b6e` (Task 2 commit)

---

**6. [Rule 1 - Bug] useTypingEngine: typing past end of word accesses out-of-bounds char**
- **Found during:** Task 3 / checkpoint human verification
- **Issue:** User could type additional characters after reaching the last char of a word (before pressing Space), causing `word.chars[currentCharIndex]` to be undefined and producing runtime errors
- **Fix:** Added `if (currentCharIndex >= word.chars.length) return state` guard at the start of the PRINTABLE_KEY case, before the char access
- **Files modified:** `hooks/useTypingEngine.ts`
- **Verification:** All 14 unit tests pass; build exits 0
- **Committed in:** `f5a95bd` (post-checkpoint fix commit)

---

**Total deviations:** 6 auto-fixed (4 Rule 1 - Bug, 2 Rule 3 - Blocking)
**Impact on plan:** All auto-fixes required for correctness, build success, and axe-core compliance. No scope creep.

## Issues Encountered
None beyond deviations documented above.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Phase 1 complete: full typing test loop running at localhost:3000 with retro aesthetic
- All Phase 1 requirements satisfied: R-001 through R-011, R-070, R-071, R-075, R-076
- App is ready for Phase 2 (animations via Framer Motion) and Phase 3 (Web Audio API sounds)
- axe-core baseline established — future phases must maintain zero violations on all three screens

## Self-Check: PASSED

| Item | Status |
|------|--------|
| `app/globals.css` | FOUND |
| `app/layout.tsx` | FOUND |
| `app/page.tsx` | FOUND |
| `e2e/a11y.spec.ts` | FOUND |
| `hooks/useTypingEngine.ts` | FOUND |
| `01-06-SUMMARY.md` | FOUND |
| Commit `ca1b2b7` (Task 1) | FOUND |
| Commit `16c1b6e` (Task 2) | FOUND |
| Commit `04e3421` (metadata pre-checkpoint) | FOUND |
| Commit `f5a95bd` (bug fix post-checkpoint) | FOUND |

---
*Phase: 01-foundation-core-typing-engine*
*Completed: 2026-03-04*
