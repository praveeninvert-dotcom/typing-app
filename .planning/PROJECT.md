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

### Active (v1.1 — Phase 3)

- [ ] Correct keypress plays typewriter-style click (Web Audio API)
- [ ] Incorrect keypress plays distinct lower harsh tone
- [ ] All sounds generated via Web Audio API — no external audio files
- [ ] Caps Lock on shows warning banner below TextDisplay (role="alert")
- [ ] Caps Lock warning disappears when Caps Lock turns off
- [ ] Escape during test shows quit confirmation (YES/NO)
- [ ] Timer freezes while quit confirmation is visible
- [ ] YES in quit confirmation returns to home screen, no result shown
- [ ] NO dismisses confirmation and resumes timer
- [ ] Escape while confirmation showing dismisses it (same as NO)
- [ ] Space and Backspace before first character do not start timer
- [ ] Home screen elements stagger-fade in on mount
- [ ] Difficulty button selection has pulse and underline slide animation
- [ ] Screen transitions use fade and slide (already done in v1.0, extend as needed)
- [ ] Wrong key press shakes current word briefly
- [ ] Correct word completion triggers brief green flash
- [ ] Result overlay enters with spring scale animation
- [ ] Result stats count up from zero on overlay mount (done in v1.0 for WPM/accuracy)
- [ ] TextDisplay scrolls smoothly when active line changes
- [ ] Cursor blink pauses while user is actively typing
- [ ] Caps Lock warning uses role="alert"
- [ ] Quit confirmation traps focus, returns on dismiss
- [ ] Result overlay traps focus, Retry gets focus on mount
- [ ] Test complete announced via aria-live on result mount

### Out of Scope

- Sound toggle UI — Web Audio API only, no UI control in v1
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

**Shipped v1.0** with 2,130 LOC TypeScript/TSX/CSS.
Tech stack: Next.js 14, TypeScript strict, Tailwind CSS, Framer Motion, Web Audio API (stubbed), Vitest, Playwright + axe-core.

**v1.0 test results:** 14 unit tests pass (useTypingEngine), axe-core passes on all three screens (Home, Test, Result).

**Known tech debt from v1.0:**
- Word-exhaustion stale closure: `onFinish` on exhaustion path may be off by ±1 correct char (timer-expiry is correct)
- `useKeystrokeSound` is a stub — actual Web Audio implementation deferred to Phase 3

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

---

## Constraints

- Pure frontend — no backend, no auth, no persistence
- No audio files in /public — Web Audio API only
- No routing — single-page, screen state machine only
- TypeScript strict mode throughout
- Accessibility: axe-core must pass on all screens

---

*Last updated: 2026-03-05 after v1.0 milestone*
