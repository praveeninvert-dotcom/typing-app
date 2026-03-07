# PROJECT.md

## What This Is

A retro terminal-aesthetic typing speed test. 60 seconds, three difficulty levels, live WPM and accuracy stats, keystroke sounds. No accounts. No data stored. Load the page, pick a difficulty, type. Nothing else.

Built as a benchmark: how well does Claude Code perform when every screen, element, animation, and edge case is fully pre-specified?

---

## Core Value

Zero friction. No account required. No data stored. The retro aesthetic makes it distinct from every generic white-background typing test site.

---

## Target Users

Primary: Developers and keyboard enthusiasts who want a quick WPM check without signing up for anything.
Secondary: Anyone who wants a focused, distraction-free typing practice environment.

---

## Requirements

### Validated

- ✓ User can select Easy, Medium, or Hard difficulty — v1.0
- ✓ Selecting a difficulty enables the Start button — v1.0
- ✓ Test displays words from selected difficulty pool — v1.0
- ✓ Timer starts on first printable keypress — v1.0
- ✓ Timer counts down from 60 seconds — v1.0
- ✓ Characters marked correct (green) or incorrect (red) as typed — v1.0
- ✓ Blinking cursor indicates current expected character — v1.0
- ✓ Space advances to next word regardless of correctness — v1.0
- ✓ Backspace deletes last char of current word only — v1.0
- ✓ Timer zero ends test and shows result overlay — v1.0
- ✓ Word list exhaustion ends test immediately — v1.0
- ✓ WPM displayed and recalculated every second — v1.0
- ✓ Accuracy percentage displayed and updated every second — v1.0
- ✓ Countdown timer displayed during test — v1.0
- ✓ StatsBar hidden until first keypress, then animates in — v1.0
- ✓ Timer value turns red and pulses at 10 seconds — v1.0
- ✓ Result overlay shows final WPM — v1.0
- ✓ Result overlay shows final accuracy percentage — v1.0
- ✓ Result overlay shows correct and incorrect character counts — v1.0
- ✓ Retry starts fresh test with same difficulty, no home trip — v1.0
- ✓ Home returns to home screen with difficulty selection reset — v1.0
- ✓ All interactive elements keyboard navigable — v1.0
- ✓ axe-core scan passes on all three screens — v1.0
- ✓ DifficultySelector uses role="radiogroup" and role="radio" — v1.0
- ✓ Hidden input has aria-label — v1.0

### Active (v1.2 — next milestone)

- [ ] R-067: TextDisplay.module.css needs `overflow-y: auto` on `.container` — JS scrollTo() is wired but scroll has no visual effect without the CSS property (single-line fix, deferred from v1.1)

### Validated (v1.1 — Phases 3–4)

- ✓ Correct keypress plays typewriter-style click (Web Audio API square-wave 800Hz) — v1.1
- ✓ Incorrect keypress plays distinct lower harsh tone (sawtooth 200Hz) — v1.1
- ✓ All sounds generated via Web Audio API — no external audio files — v1.1
- ✓ Caps Lock on shows warning banner (role="alert") — v1.1
- ✓ Caps Lock warning disappears on toggle off — v1.1
- ✓ Escape shows quit confirmation with YES/NO — v1.1
- ✓ Timer freezes while quit confirmation visible (pausedRef gate) — v1.1
- ✓ YES returns home, no result shown — v1.1
- ✓ NO dismisses and resumes timer — v1.1
- ✓ Escape while confirmation showing dismisses it — v1.1
- ✓ Space/Backspace before first character ignored — v1.1
- ✓ Home screen stagger-fade entrance — v1.1
- ✓ Difficulty selection pulse + underline slide animation — v1.1
- ✓ Screen transitions fade and slide — v1.1
- ✓ Wrong key shakes current word — v1.1
- ✓ Correct word green flash — v1.1
- ✓ Result overlay spring scale entrance — v1.1
- ✓ Result stats count up from zero — v1.1
- ✓ Cursor blink pauses while actively typing — v1.1
- ✓ Caps Lock warning uses role="alert" — v1.1
- ✓ Quit confirmation focus trap, returns on dismiss — v1.1
- ✓ Result overlay focus trap, RETRY autoFocus — v1.1
- ✓ Test complete announced via aria-live — v1.1
- ✓ StarField three-layer CSS parallax star background — v1.1
- ✓ DifficultySelector horizontal pixel-art cards, amber selected state — v1.1
- ✓ TestScreen bordered container (900px, amber-dim border) — v1.1
- ✓ StatsBar 3-column CSS grid with column dividers — v1.1
- ✓ ResultOverlay retro pixel-border game-over design with PLAY AGAIN? — v1.1
- ✓ Sound toggle removed — sound always on — v1.1

### Out of Scope

- Sound toggle UI — removed in v1.1; sound always on; opt-out moved to v2 out-of-scope
- localStorage score history — no persistence by design
- Leaderboard — counter to zero-friction philosophy
- Mobile and touch support — keyboard-first product, web-first
- Custom text input mode — out of v1 scope
- Pause mechanic — Escape quits, it does not pause
- Multiple color themes — one retro aesthetic, no switching
- Typing test for code snippets — out of v1 scope
- User accounts or authentication — never
- Server-side anything — never
- Native mobile apps — never

---

## Context

**Shipped v1.1** with 3,473 LOC TypeScript/TSX/CSS.
Tech stack: Next.js 14, TypeScript strict, Tailwind CSS, Framer Motion, Web Audio API (live — no stub), Vitest, Playwright + axe-core.

**v1.1 test count:** 59+ unit tests (useTypingEngine 14, DifficultySelector 7, StatsBar 13, TestScreen 6, ResultOverlay 15, StarField 4), axe-core passes on all screens including quit confirmation modal.

**Known tech debt from v1.1:**
- R-067: `TextDisplay.module.css` missing `overflow-y: auto` — JS scroll wired, CSS gap deferred by user. Single-property fix.
- `useKeystrokeSound` has dead `soundEnabled?: boolean` optional param — never exercised after toggle removal. Cleanup when convenient.
- 7 items in 04-VERIFICATION.md need human browser confirmation (visual/audio behaviors)
- Word-exhaustion stale closure from v1.0 still present (carries forward)

---

## Key Decisions

| Decision | Outcome | Notes |
|----------|---------|-------|
| Manual Next.js scaffold (not create-next-app) | ✓ Good | create-next-app refuses non-empty directories |
| vite-tsconfig-paths@4 (CJS) not v5 (ESM) | ✓ Good | v5 breaks vitest.config.ts as .ts file |
| Framer Motion for StatsBar/ResultOverlay animations | ✓ Good | Clean declarative API, no manual CSS transitions needed |
| AnimatePresence mode=wait for screen transitions | ✓ Good | Exit completes before entry — feels intentional, equal weight |
| testKey counter for TestScreen remount (not motion.div key) | ✓ Good | New word list without triggering parent exit/enter animation |
| opacity:0 (not display:none) for StatsBar pre-start | ✓ Good | Height always reserved, no layout shift on reveal |
| useCountUp hook (setTimeout-based, easeOut) | ✓ Good | Clean separation, 10-step odometer feel |
| pausedRef (not state) gates setInterval in useCountdown | ✓ Good | Zero re-render overhead on pause/resume; reset() also clears it |
| Lazy AudioContext via useRef in useKeystrokeSound | ✓ Good | Satisfies CLAUDE.md rule: AudioContext never on mount, only on first interaction |
| Sound toggle removed in Phase 4 (always on) | ✓ Good | Sound is the signature feature; R-200 (toggle UI) moved to v2 out-of-scope |
| CSS box-shadow star technique for StarField (3 layers) | ✓ Good | Pure CSS, no canvas, no images; prefers-reduced-motion pauses animation |
| DifficultySelector value prop (not selected) | ✓ Good | Standard controlled component convention; cleaner call site |
| 3-keyframe spring fix (tween with times:[0,0.5,1]) | ✓ Good | Framer Motion springs support only 2 keyframes; tween with times is correct for bounce |

---

## Constraints

- Pure frontend — no backend, no auth, no persistence
- No audio files in /public — Web Audio API only
- No routing — single-page, screen state machine only
- TypeScript strict mode throughout
- Accessibility: axe-core must pass on all screens

---

*Last updated: 2026-03-07 after v1.1 milestone*
