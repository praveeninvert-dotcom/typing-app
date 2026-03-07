# Milestones

## v1.0 Functional Retro Typing Test (Shipped: 2026-03-05)

**Phases completed:** 2 phases, 9 plans
**Files changed:** 55 files (13,510 insertions)
**Lines of code:** 2,130 TypeScript/TSX/CSS
**Timeline:** 2 days (2026-03-04 → 2026-03-05)
**Requirements:** 25/25 satisfied (R-001–R-034, R-070–R-071, R-075–R-076)

**Delivered:** Fully functional retro typing speed test — 60-second timer, three difficulty levels, live WPM/accuracy stats with Framer Motion animations, AnimatePresence screen transitions, and axe-core accessibility on all screens.

**Key accomplishments:**
- Next.js 14 + TypeScript project scaffold with Vitest unit tests and Playwright E2E/axe-core infrastructure
- Typing state machine (`useTypingEngine`) with 14 unit tests — char comparison, word advancement, backspace, WPM/accuracy formulas
- Complete component tree (DifficultySelector, StatsBar, TextDisplay, ResultOverlay, HomeScreen, TestScreen, TypingApp) with full keyboard navigation and ARIA
- Live stats with Framer Motion — StatsBar fade-in on first keypress, TIME warning pulse at 10s
- ResultOverlay count-up animations (WPM 800ms, accuracy 600ms with delay) and character breakdown fade-in
- AnimatePresence screen transitions (200ms fade, mode=wait); axe-core passes on all three screens

**Tech debt noted:**
- Word-exhaustion stale closure: `onFinish` on exhaustion path may be off by ±1 correct char (timer-expiry path is correct)
- Phase 3 requirements (R-040–R-077 remainder) deferred: sounds, Caps Lock, Escape quit, remaining animations, focus traps

---

## v1.1 Sounds + Edge Cases + Animations + A11y + UI Polish (Shipped: 2026-03-07)

**Phases completed:** 2 phases (3–4), 8 plans
**Files changed:** 60 files (7,290 insertions, 303 deletions since v1.0)
**Lines of code:** 3,473 total TypeScript/TSX/CSS
**Timeline:** 2 days (2026-03-05 → 2026-03-07)
**Requirements:** 30/31 satisfied (R-067 CSS gap deferred by user; all others complete)

**Delivered:** Full production quality — Web Audio API keystroke sounds, Caps Lock + Escape quit edge cases, complete Framer Motion animation suite, a11y finalization, and full retro aesthetic polish (StarField, pixel-art difficulty cards, bordered test container, retro game-over overlay).

**Key accomplishments:**
- Web Audio API keystroke sounds — square-wave 800Hz correct click, sawtooth 200Hz incorrect tone, lazy `AudioContext` on first keypress (R-040–R-042)
- Caps Lock warning (`role="alert"`) + Escape quit confirmation with `pausedRef` timer freeze, focus trap (YES/NO), and timer resume on dismiss (R-050–R-057, R-072–R-073)
- Full Framer Motion animation suite — home stagger, difficulty pulse/underline, screen slides ±40px, wrong-key shake via `useAnimation`, correct-word green flash, cursor blink pause on active typing (R-060–R-064, R-067, R-068)
- ResultOverlay a11y finalization — spring scale entrance (stiffness 280, damping 22), focus trap with RETRY `autoFocus`, `aria-live="polite"` "Test complete" announcement (R-065, R-074, R-077)
- StarField three-layer CSS parallax star background (120s/80s/50s) with `prefers-reduced-motion` pause, `aria-hidden`, rendered behind all screens via TypingApp (04-01)
- Retro aesthetic polish — horizontal pixel-art difficulty cards (amber `rgba(180,100,0,0.35)` selected state), 900px amber-bordered test container, 3-column CSS grid StatsBar with dividers, pixel double-border game-over overlay with `PLAY AGAIN?` and count-up stats (04-02–04-04)

**Tech debt noted:**
- R-067: `TextDisplay.module.css` missing `overflow-y: auto` — JS `scrollTo()` wired but scroll non-visual; deferred by user instruction
- `useKeystrokeSound` has dead `soundEnabled` optional param after toggle removal
- 7 items require human browser confirmation (StarField visual, DifficultySelector amber state, StatsBar grid, TIME red at 10s, count-up animation, RETRY focus, sound playback)

---

