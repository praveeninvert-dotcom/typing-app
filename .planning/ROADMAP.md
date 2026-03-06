# Roadmap: Retro Typing Test

## Milestones

- ✅ **v1.0 Functional Retro Typing Test** — Phases 1–2 (shipped 2026-03-05)
- 📋 **v1.1 Sounds + Edge Cases + A11y** — Phase 3 (planned)

## Phases

<details>
<summary>✅ v1.0 Functional Retro Typing Test (Phases 1–2) — SHIPPED 2026-03-05</summary>

- [x] Phase 1: Foundation + Core Typing Engine (6/6 plans) — completed 2026-03-05
- [x] Phase 2: Live Stats + Result Polish (3/3 plans) — completed 2026-03-05

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 📋 v1.1 Sounds + Edge Cases + A11y (Planned)

- [ ] Phase 3: Sounds + Edge Cases + Animations + A11y (4 plans)

**Phase 3 Goal:** Full production quality. All animations, all edge cases, full a11y.

Requirements: R-040 to R-042 (sounds), R-050 to R-057 (edge cases), R-060 to R-068 (animations), R-072 to R-074, R-077 (a11y)

Plans:
- [ ] 03-01-PLAN.md — Web Audio API sounds + SND toggle
- [ ] 03-02-PLAN.md — Caps Lock warning + Escape quit confirmation + Space/Backspace guard
- [ ] 03-03-PLAN.md — All Framer Motion animations (home stagger, difficulty pulse, slide transitions, shake, flash, scroll, blink pause)
- [ ] 03-04-PLAN.md — ResultOverlay spring + focus trap + aria-live + reduced motion + axe-core

Includes:
- `hooks/useKeystrokeSound.ts` — Web Audio API, correct (square 800Hz 60ms) and wrong (sawtooth 200Hz 100ms)
- Caps Lock warning banner with `role="alert"`, fades in/out
- Escape quit confirmation with timer freeze, YES/NO, focus trap
- All Framer Motion animations: home stagger, difficulty select pulse + underline, wrong key shake, correct word flash, TextDisplay smooth scroll, result spring
- Cursor blink pause on active typing (300ms debounce)
- Focus traps in quit confirmation and result overlay
- `aria-live` announcement on test complete

Exit criteria: Sounds play. Caps Lock warning works. Escape quit flow complete. All animations play. axe-core passes. Focus trapped in both overlays.

## Progress

| Phase | Milestone | Plans Complete | Status   | Completed  |
|-------|-----------|----------------|----------|------------|
| 1. Foundation + Core Typing Engine | v1.0 | 6/6 | Complete | 2026-03-05 |
| 2. Live Stats + Result Polish | v1.0 | 3/3 | Complete | 2026-03-05 |
| 3. Sounds + Edge Cases + Animations + A11y | 2/4 | In Progress|  | — |
