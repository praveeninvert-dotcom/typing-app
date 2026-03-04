# STATE.md — Retro Typing Test

## Project Reference

**What:** Retro terminal-style typing speed test. 60s, 3 difficulty levels, Web Audio API sounds.
**Core value:** Zero friction. Load, pick difficulty, type. No accounts, no storage.
**Milestone:** v1.0 — Functional Retro Typing Test (Phases 1–3)

---

## Current Position

**Phase:** 1 of 3 — Foundation + Core Typing Engine
**Current Plan:** 2 of 7 (01-02-PLAN.md next)
**Status:** In Progress
**Progress:** [█░░░░░░░░░] 10%

---

## Recent Decisions

1. Used `next.config.mjs` instead of `next.config.ts` — Next.js 14 does not support TypeScript config files.
2. Manually scaffolded Next.js (npm init + install) instead of create-next-app — create-next-app refuses directories with existing files (.planning/, CLAUDE.md, etc.).
3. Used vite-tsconfig-paths@4 (CJS-compatible) instead of v5 (ESM-only) — allows vitest.config.ts to load correctly without ESM configuration changes.
4. Word lists: easy=200 short common words, medium=500 words+contractions, hard=1000 words+numbers+symbols+software vocabulary.

---

## Pending Todos

None.

---

## Blockers / Concerns

None.

---

## Session Continuity

Last session: 2026-03-04
Stopped at: Completed 01-01-PLAN.md — scaffold + data foundation done
Resume file: .planning/phases/01-foundation-core-typing-engine/01-02-PLAN.md
