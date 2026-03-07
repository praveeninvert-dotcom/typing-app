# STATE.md — Retro Typing Test

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-05)

**What:** Retro terminal-style typing speed test. 60s, 3 difficulty levels, Web Audio API sounds.
**Core value:** Zero friction. Load, pick difficulty, type. No accounts, no storage.
**Current focus:** Phase 4 UI Polish complete — v1.1 milestone ready for audit

---

## Current Position

**Status:** v1.1 milestone complete
**Phase:** 04-ui-polish
**Current Plan:** 04-01, 04-02, 04-03, 04-04 — all complete
**Phases archived:** Phases 1–2 in `.planning/milestones/v1.0-phases/`

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
22. 5-second WPM guard uses `>= 5` (not `> 0`) — suppresses early WPM spikes in first 5 seconds per 02-CONTEXT.md user decision.
23. timeWarning condition includes `> 0` — stops TIME pulse when test ends at exactly 0 (not just <= 10).
24. StatsBar uses Framer Motion motion.div with initial={{ opacity: 0, y: -8 }} — height always reserved (no layout shift), animate drives visibility on started prop.
25. useCountUp uses setTimeout chains (not requestAnimationFrame) — predictable step count matches retro odometer aesthetic, simpler stepped animation than rAF loop.
26. CSS transition on opacity (not @keyframes) for breakdownVisible class toggle — cleaner response to class addition without animation fill-mode concerns.
27. framer-motion installed to resolve missing dependency — StatsBar already imported it from Phase 1 but package was absent from package.json.
28. AnimatePresence mode="wait" on TypingApp: exit animation (200ms) completes before entry animation starts — both RETRY and HOME use identical sequential fade treatment.
29. testKey counter on inner TestScreen (not outer motion.div): forces TestScreen remount for new word list on Retry without triggering outer motion.div exit/enter animation cycle.
30. soundEnabled defaults to true — sounds are the signature feature; user opts out rather than in (03-01).
31. Sound determined pre-dispatch: compare key to currentWord.chars[currentCharIndex].expected before engine.handleKey() call — no re-render needed to classify the keypress (03-01).
32. stopPropagation on SND toggle click button — prevents click from bubbling to main container and re-focusing the hidden input (03-01).
33. pausedRef (not state) gates setInterval tick in useCountdown — zero re-render overhead on pause/resume; reset() also clears it to prevent stuck-paused state (03-02).
34. Caps Lock monitored on both hidden input keydown and window listener — catches OS-level toggle outside the focused input (03-02).
35. Focus trap for quit modal implemented on quitOverlay onKeyDown (not document) — simpler lifecycle, Tab cycles between YES/NO refs only (03-02).
36. ResultOverlay preserves result: ResultState prop interface (not flat props) — matches TypingApp.tsx call site; flat props would require TypingApp modification for no benefit (04-04).
37. ResultOverlay count-up uses setTimeout chains (not rAF loop) — predictable 10 visible steps match retro odometer aesthetic, simpler cleanup than animation frame loop (04-04).
38. ResultOverlay staggered reveal: breakdown 900ms, playAgain 1100ms, buttons 1300ms — progressive disclosure adds visual rhythm without Framer Motion complexity for these later elements (04-04).
39. Sound toggle button fully removed from TestScreen (04-03) — sound always on, no user opt-out; useKeystrokeSound still called, playCorrect/playIncorrect still fire on every keypress (R-040, R-041).
40. timeWarning prop retained on StatsBar (04-03) — computed as timeLeft <= 10 && started && timeLeft > 0 in TestScreen rather than inside StatsBar; keeps StatsBar pure and independently testable.
41. CSS grid 1fr/1fr/1fr for StatsBar (04-03) — middle column left+right border dividers; font-variant-numeric:tabular-nums + min-width:80px on all stat values prevents layout shift.
42. StarField uses CSS box-shadow on 1px×1px divs (3 layers: 120s/80s/50s) — pure CSS, no canvas, prefers-reduced-motion pauses animation (04-01).
43. DifficultySelector switched to value prop (not selected) — motion.button with amber selected state rgba(180,100,0,0.35), horizontal flex row, role=radiogroup/radio (04-02).

---

## Pending Todos

None.

---

## Blockers / Concerns

None.

---

## Session Continuity

Last session: 2026-03-07
Stopped at: Phase 04-ui-polish complete — all 4 plans executed (StarField, DifficultySelector, TestScreen/StatsBar, ResultOverlay)
Resume file: None
