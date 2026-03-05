# Phase 1: Foundation + Core Typing Engine - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build every component in the defined build order with full styling and core mechanics working. No Framer Motion animations, no sounds, no Escape/CapsLock edge cases. The test loop must be complete: select difficulty → start → type words → characters marked correct/incorrect → timer counts to zero → result overlay shows WPM and accuracy → Retry and Home work. Tab navigation works. axe-core passes.

Components: `types/index.ts`, `lib/constants.ts`, `lib/wordLists.ts`, `lib/generateText.ts`, `hooks/useCountdown.ts`, `hooks/useTypingEngine.ts`, `components/DifficultySelector/`, `components/StatsBar/`, `components/TextDisplay/`, `components/ResultOverlay/`, `components/HomeScreen/`, `components/TestScreen/`, `components/TypingApp.tsx`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`

</domain>

<decisions>
## Implementation Decisions

### Styling depth
- Full retro aesthetic from day 1: CSS custom properties in globals.css, Press Start 2P and VT323 fonts, amber/blue/green/red palette, CRT overlay via body::after
- All color tokens as CSS custom properties exactly as defined in CLAUDE.md
- Tailwind CSS + CSS Modules per component (e.g. `DifficultySelector.module.css`)
- No skeleton-first approach — build to spec from the start

### Animations in Phase 1
- Zero Framer Motion in Phase 1 — all animation imports and variants are deferred to Phase 3
- Static renders only: components appear instantly, no stagger, no count-up, no shake
- CRT scanlines/vignette via CSS are included (it's a global style, not Framer Motion)
- Cursor blink (CSS animation, not JS) IS included — it's a CSS-only effect

### StatsBar scope
- StatsBar is rendered with correct structure but starts with `opacity: 0`
- Height is always reserved (never `display: none`) per CLAUDE.md architecture rule
- WPM, accuracy, and TIME values are wired and updating in Phase 1 — the stats calculations are part of `useTypingEngine.ts` which is Phase 1
- StatsBar animates in on first keypress (Phase 2 R-023) — in Phase 1, it stays hidden until Phase 2 adds the fade-in animation; the opacity toggle can be a simple state change

### ResultOverlay scope
- Fully functional in Phase 1: shows WPM and accuracy (per Phase 1 exit criteria in ROADMAP)
- Correct/incorrect character counts displayed
- Retry (same difficulty, no Home trip) and Home buttons wired
- No spring scale animation, no count-up animation — static display
- Enter on result screen triggers Retry (per SCREENS.md edge cases)

### Word lists
- Real curated word lists from day 1: 200 words for Easy, 500 for Medium, 1000 for Hard
- `generateText.ts` samples `WORDS_PER_TEST` words and builds the full `Word[]` array with `Char[]` children
- Word pool is large enough that the 60s test never exhausts it (~80+ words generated)

### Component structure
- Each component in its own folder: `components/ComponentName/index.tsx` + `ComponentName.module.css`
- Build order from CLAUDE.md is the implementation sequence
- Types defined in `types/index.ts` exactly matching SCREENS.md state shape — no deviation
- Constants in `lib/constants.ts`: TIMER_DURATION=60, WORDS_PER_TEST, frequency values for future audio

### Accessibility (Phase 1 required)
- DifficultySelector: `role="radiogroup"`, each button `role="radio"`, `aria-checked`
- Hidden input: `aria-label="Type here"` (or similar descriptive label)
- All interactive elements keyboard navigable (Tab, arrow keys for difficulty, Enter for Start/Retry/Home)
- axe-core must pass on all three screens

### Claude's Discretion
- Exact word content of the word lists (common English words appropriate per difficulty)
- CSS Module class naming conventions
- Exact WORDS_PER_TEST constant value (somewhere between 60–100 words)
- StatsBar opacity transition mechanism in Phase 1 (simple React state is fine, animation comes in Phase 3)
- How to handle the `cursor` char state visually in Phase 1 (CSS border-left per SCREENS.md is the spec)

</decisions>

<specifics>
## Specific Ideas

- SCREENS.md is the authoritative source for exact pixel sizes, colors, interaction states, and edge case behavior
- REQUIREMENTS.md Phase 1 scope: R-001 to R-011, R-070, R-071, R-075, R-076
- The title in HomeScreen is `TYPING.EXE` with a blinking amber block cursor `█` (CSS animation)
- TextDisplay uses character-level `<span>` elements with four states: untyped/correct/incorrect/cursor
- Current word gets an amber bottom border; completed incorrect words get a dim red background tint
- Hidden input re-focuses on any click of the Test screen
- Timer starts on first **printable** keypress (not Space, not Backspace)
- Space advances word regardless of correctness; Backspace cannot cross word boundaries

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope. All polish, animations, sounds, and edge cases (Escape quit flow, CapsLock warning, cursor blink pause) are Phase 3.

</deferred>

---

*Phase: 01-foundation-core-typing-engine*
*Context gathered: 2026-03-04*
