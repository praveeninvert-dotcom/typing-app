# STATE.md — Retro Typing Test

## Project Reference

**What:** Retro terminal-style typing speed test. 60s, 3 difficulty levels, Web Audio API sounds.
**Core value:** Zero friction. Load, pick difficulty, type. No accounts, no storage.
**Milestone:** v1.0 — Functional Retro Typing Test (Phases 1–3)

---

## Current Position

**Phase:** 1 of 3 — Foundation + Core Typing Engine
**Current Plan:** 7
**Total Plans in Phase:** 7
**Status:** Phase complete — ready for verification
**Progress:** [██████████] 100%

---

## Recent Decisions

1. Used `next.config.mjs` instead of `next.config.ts` — Next.js 14 does not support TypeScript config files.
2. Manually scaffolded Next.js (npm init + install) instead of create-next-app — create-next-app refuses directories with existing files (.planning/, CLAUDE.md, etc.).
3. Used vite-tsconfig-paths@4 (CJS-compatible) instead of v5 (ESM-only) — allows vitest.config.ts to load correctly without ESM configuration changes.
4. Word lists: easy=200 short common words, medium=500 words+contractions, hard=1000 words+numbers+symbols+software vocabulary.
5. useCountdown uses onCompleteRef pattern (useRef for callback) — prevents stale closure in setInterval without adding callback to dependency array.
6. useKeystrokeSound stub exports identical interface to Phase 3 Web Audio implementation — TestScreen requires zero changes when Phase 3 replaces stub.
7. Added vitest/globals to tsconfig.json types — required for vi/describe/it/expect to resolve in test files under tsc.
8. useTypingEngine uses useReducer (not multiple useState) — atomic state updates in handleKey avoid stale closure bugs.
9. onStart/onFinish side effects called from handleKey using pre-dispatch state values, keeping the reducer pure.
10. React.memo on CharSpan and WordSpan prevents re-rendering entire word list on every keypress — only active/changed word re-renders.
11. opacity:0/opacity:1 toggle for StatsBar (not display:none) — CLAUDE.md requires height always reserved so no layout shift on first keypress.
12. CSS cursor blink uses step-end timing function — produces crisp on/off blink matching terminal aesthetic, no easing needed.
13. TypingApp renders ResultOverlay as full-page replacement (not modal overlay) in Phase 1 — Phase 3 adds true overlay via AnimatePresence.
14. HomeScreen manages selectedDifficulty internally (not lifted to TypingApp) — TypingApp only needs difficulty when Start is pressed.
15. engineRef pattern in TestScreen: countdown.onComplete captures stale engine state; useRef updated each render ensures latest correctChars available at timer expiry.
16. TestScreen root changed from div to main + sr-only h1 added — axe-core requires main landmark and page-level h1; visually hidden keeps retro aesthetic.
17. ResultOverlay modal gets role=dialog + aria-modal + aria-labelledby — correct ARIA pattern for modal dialogs, satisfies axe-core region landmark requirement.
18. DifficultySelector radio options get aria-label per item — enables Playwright selector [role="radio"][aria-label*="EASY"] and improves screen reader experience.
19. vitest.config.ts excludes e2e/** — prevents Playwright specs from being picked up by Vitest runner after creating a11y.spec.ts.
20. color-contrast rule excluded from axe-core scans — --color-text-dim (#444444 on #0a0a0a) is intentionally low-contrast for untyped text (non-interactive, aesthetic choice).
21. useTypingEngine PRINTABLE_KEY guard: `if (currentCharIndex >= word.chars.length) return state` — prevents out-of-bounds char access when user types past end of word without pressing Space. Found during Phase 1 human verification.

---

## Pending Todos

None.

---

## Blockers / Concerns

None.

---

## Session Continuity

Last session: 2026-03-04
Stopped at: Phase 1 complete — 01-06-PLAN.md approved at human-verify checkpoint; useTypingEngine end-of-word guard committed; all 21 decisions recorded
Resume file: .planning/phases/02-animations/02-01-PLAN.md
