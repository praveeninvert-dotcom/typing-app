---
phase: 01-foundation-core-typing-engine
plan: "01"
subsystem: project-scaffold
tags: [next.js, typescript, vitest, playwright, types, word-lists, constants]
dependency_graph:
  requires: []
  provides:
    - types/index.ts (Screen, Difficulty, CharState, WordState, AppState, Char, Word, TestState, ResultState)
    - lib/constants.ts (TIMER_DURATION, WORDS_PER_TEST, CORRECT_FREQ, INCORRECT_FREQ)
    - lib/wordLists.ts (easy=200, medium=500, hard=1000 word arrays)
    - lib/generateText.ts (generateText function returning Word[])
    - vitest.config.ts (test runner with jsdom + React plugin)
    - playwright.config.ts (E2E runner with chromium + axe-core)
  affects: []
tech_stack:
  added:
    - next@14.2.35
    - react@18.3.1
    - react-dom@18.3.1
    - typescript@5
    - tailwindcss@3.4.14
    - vitest@2.1.9
    - vite-tsconfig-paths@4.3.2 (CJS-compatible)
    - '@testing-library/react'
    - '@testing-library/jest-dom'
    - '@playwright/test'
    - '@axe-core/playwright'
    - jsdom
  patterns:
    - Next.js 14 App Router (no pages/ directory)
    - TypeScript strict mode
    - Vitest with jsdom for unit tests
    - Playwright with chromium for E2E tests
key_files:
  created:
    - package.json (Next.js 14, TypeScript, Tailwind, Vitest, Playwright)
    - tsconfig.json (strict TypeScript with @/* path alias)
    - next.config.mjs (minimal Next.js config — note: .mjs not .ts)
    - tailwind.config.ts
    - postcss.config.mjs
    - .eslintrc.json
    - vitest.config.ts (jsdom environment, tsconfigPaths, React plugin)
    - vitest.setup.ts ('@testing-library/jest-dom' import)
    - playwright.config.ts (chromium, NEXT_PUBLIC_TEST_TIMER_DURATION=3 webServer)
    - e2e/ directory
    - types/index.ts (9 exported types matching SCREENS.md exactly)
    - lib/constants.ts (TIMER_DURATION env-overridable, WORDS_PER_TEST=80)
    - lib/wordLists.ts (easy=200, medium=500, hard=1000 words)
    - lib/generateText.ts (Fisher-Yates shuffle, returns WORDS_PER_TEST Word[])
    - app/layout.tsx (placeholder — replaced in Plan 06)
    - app/page.tsx (placeholder — replaced in Plan 06)
    - app/globals.css (placeholder — replaced in Plan 06)
    - .gitignore
  modified: []
decisions:
  - "Used next.config.mjs instead of next.config.ts because Next.js 14 does not support .ts config files"
  - "Manually scaffolded Next.js (npm init + install) instead of create-next-app because create-next-app refuses directories with existing files"
  - "Used vite-tsconfig-paths@4 (CJS-compatible) instead of v5 (ESM-only) to allow vitest.config.ts to remain as a .ts file"
  - "Word lists: easy words are 2-5 letter common words; medium adds contractions and mid-complexity words; hard adds numbers, symbols, and software engineering vocabulary"
metrics:
  duration: "13m 19s"
  completed: "2026-03-04"
  tasks_completed: 2
  tasks_total: 2
  files_created: 18
  files_modified: 0
  commits: 2
---

# Phase 1 Plan 01: Project Scaffold + Data Foundation Summary

**One-liner:** Next.js 14 App Router project with Vitest/Playwright test infrastructure, TypeScript types from SCREENS.md, and fully populated 200/500/1000-word lists with generateText returning shuffled Word[] arrays.

---

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Scaffold Next.js 14 project with test dependencies | 44ecc11 | package.json, tsconfig.json, next.config.mjs, vitest.config.ts, vitest.setup.ts, playwright.config.ts, app/ |
| 2 | Create types/index.ts, lib/constants.ts, lib/wordLists.ts, lib/generateText.ts | 0f7876a | types/index.ts, lib/constants.ts, lib/wordLists.ts, lib/generateText.ts |

---

## Verification Results

1. `npx tsc --noEmit` — PASS (zero errors)
2. `npm run build` — PASS (Next.js 14 production build succeeds)
3. Word list counts — PASS: easy=200, medium=500, hard=1000
4. Config files exist — PASS: vitest.config.ts, vitest.setup.ts, playwright.config.ts, e2e/
5. NEXT_PUBLIC_TEST_TIMER_DURATION present in playwright.config.ts and lib/constants.ts — PASS
6. All 9 types in types/index.ts — PASS: Screen, Difficulty, CharState, WordState, AppState, Char, Word, TestState, ResultState

---

## Decisions Made

1. **next.config.mjs vs next.config.ts:** Next.js 14 does not support `.ts` config files (only `.js` or `.mjs`). Used `.mjs` with JSDoc type annotation.

2. **Manual scaffold vs create-next-app:** `create-next-app` refuses to run in directories with existing files (.planning/, CLAUDE.md, etc.). Scaffolded manually via `npm init` + individual package installs — produces identical result.

3. **vite-tsconfig-paths@4 vs v5:** The `vite-tsconfig-paths` v5 is ESM-only and cannot be loaded by vitest when the project has no `"type": "module"` in package.json. Downgraded to v4.x which ships both CJS and ESM builds. This allows `vitest.config.ts` to remain as a `.ts` file as specified in the plan.

4. **Word list content:** Easy list is 200 common short English words (2-5 letters). Medium list is 500 words adding medium-complexity vocabulary plus contractions (can't, don't, I'm, you're, etc.). Hard list is 1000 words adding software/tech vocabulary, numbers (1-1000), symbols (@, #, &, !, ?), and complex multi-syllable words.

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] next.config.ts renamed to next.config.mjs**
- **Found during:** Task 1 build verification
- **Issue:** Next.js 14 does not support TypeScript config files — throws "Configuring Next.js via 'next.config.ts' is not supported" error
- **Fix:** Renamed to `next.config.mjs` with JSDoc type annotation instead of TypeScript import
- **Files modified:** next.config.mjs (renamed from next.config.ts)
- **Commit:** 44ecc11

**2. [Rule 1 - Bug] vite-tsconfig-paths downgraded to v4 for CJS compatibility**
- **Found during:** Task 1 test verification (`npm run test`)
- **Issue:** vite-tsconfig-paths v5 is ESM-only; vitest could not load it via CJS require, throwing "ESM file cannot be loaded by require" error
- **Fix:** Installed vite-tsconfig-paths@4 which ships both CJS and ESM builds, compatible with vitest.config.ts
- **Files modified:** package.json, package-lock.json
- **Commit:** 44ecc11

**3. [Rule 3 - Blocking] Manual scaffold instead of create-next-app**
- **Found during:** Task 1 scaffold
- **Issue:** `create-next-app@14` refuses to initialize in a non-empty directory — existing .planning/, CLAUDE.md, standards/ files triggered "directory contains files that could conflict" error
- **Fix:** Manually initialized with `npm init` + individual `npm install` commands for all dependencies. Manually created tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs, .eslintrc.json
- **Files modified:** All project config files
- **Commit:** 44ecc11

---

## Self-Check: PASSED

| Item | Status |
|------|--------|
| types/index.ts exists | FOUND |
| lib/constants.ts exists | FOUND |
| lib/wordLists.ts exists | FOUND |
| lib/generateText.ts exists | FOUND |
| vitest.config.ts exists | FOUND |
| vitest.setup.ts exists | FOUND |
| playwright.config.ts exists | FOUND |
| e2e/ directory exists | FOUND |
| Commit 44ecc11 (Task 1) | FOUND |
| Commit 0f7876a (Task 2) | FOUND |
| `npx tsc --noEmit` passes | PASS |
| `npm run build` succeeds | PASS |
| Word counts 200/500/1000 | PASS |
