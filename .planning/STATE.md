# STATE.md — Retro Typing Test

## Project Reference

**What:** Retro terminal-style typing speed test. 60s, 3 difficulty levels, Web Audio API sounds.
**Core value:** Zero friction. Load, pick difficulty, type. No accounts, no storage.
**Milestone:** v1.0 — Functional Retro Typing Test (Phases 1–3)

---

## Current Position

**Phase:** 1 of 3 — Foundation + Core Typing Engine
**Current Plan:** 4 of 7 (01-04-PLAN.md next)
**Status:** In Progress
**Progress:** [████░░░░░░] 43%

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

---

## Pending Todos

None.

---

## Blockers / Concerns

None.

---

## Session Continuity

Last session: 2026-03-04
Stopped at: Completed 01-03-PLAN.md — useTypingEngine TDD implementation done
Resume file: .planning/phases/01-foundation-core-typing-engine/01-04-PLAN.md
