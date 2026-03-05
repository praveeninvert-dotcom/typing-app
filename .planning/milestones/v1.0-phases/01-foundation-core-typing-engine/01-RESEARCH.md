# Phase 1: Foundation + Core Typing Engine - Research

**Researched:** 2026-03-04
**Domain:** Next.js 14 App Router, TypeScript strict mode, React hooks for typing engine, CSS Modules + Tailwind, ARIA accessibility
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Styling depth:** Full retro aesthetic from day 1. CSS custom properties in globals.css, Press Start 2P and VT323 fonts, amber/blue/green/red palette, CRT overlay via body::after. All color tokens as CSS custom properties exactly as defined in CLAUDE.md. Tailwind CSS + CSS Modules per component (e.g. `DifficultySelector.module.css`). No skeleton-first approach — build to spec from the start.
- **Animations in Phase 1:** Zero Framer Motion in Phase 1 — all animation imports and variants are deferred to Phase 3. Static renders only: components appear instantly, no stagger, no count-up, no shake. CRT scanlines/vignette via CSS are included (global style, not Framer Motion). Cursor blink (CSS animation, not JS) IS included — it's a CSS-only effect.
- **StatsBar scope:** StatsBar rendered with correct structure but starts with `opacity: 0`. Height always reserved (never `display: none`) per CLAUDE.md architecture rule. WPM, accuracy, and TIME values are wired and updating in Phase 1. StatsBar animates in on first keypress (Phase 2 R-023) — in Phase 1 it stays hidden; opacity toggle can be a simple state change.
- **ResultOverlay scope:** Fully functional in Phase 1: shows WPM and accuracy. Correct/incorrect character counts displayed. Retry (same difficulty, no Home trip) and Home buttons wired. No spring scale animation, no count-up animation — static display. Enter on result screen triggers Retry.
- **Word lists:** Real curated word lists from day 1: 200 words for Easy, 500 for Medium, 1000 for Hard. `generateText.ts` samples `WORDS_PER_TEST` words and builds full `Word[]` array with `Char[]` children. Word pool large enough that 60s test never exhausts it (~80+ words generated).
- **Component structure:** Each component in its own folder: `components/ComponentName/index.tsx` + `ComponentName.module.css`. Build order from CLAUDE.md is the implementation sequence. Types defined in `types/index.ts` exactly matching SCREENS.md state shape — no deviation. Constants in `lib/constants.ts`: TIMER_DURATION=60, WORDS_PER_TEST, frequency values for future audio.
- **Accessibility (Phase 1 required):** DifficultySelector: `role="radiogroup"`, each button `role="radio"`, `aria-checked`. Hidden input: `aria-label="Type here"` (or similar descriptive label). All interactive elements keyboard navigable (Tab, arrow keys for difficulty, Enter for Start/Retry/Home). axe-core must pass on all three screens.

### Claude's Discretion

- Exact word content of the word lists (common English words appropriate per difficulty)
- CSS Module class naming conventions
- Exact WORDS_PER_TEST constant value (somewhere between 60–100 words)
- StatsBar opacity transition mechanism in Phase 1 (simple React state is fine, animation comes in Phase 3)
- How to handle the `cursor` char state visually in Phase 1 (CSS border-left per SCREENS.md is the spec)

### Deferred Ideas (OUT OF SCOPE)

- None — discussion stayed within phase scope. All polish, animations, sounds, and edge cases (Escape quit flow, CapsLock warning, cursor blink pause) are Phase 3.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| R-001 | User can select Easy, Medium, or Hard difficulty | DifficultySelector component with role="radiogroup"/role="radio" pattern; React state in HomeScreen |
| R-002 | Selecting a difficulty enables the Start button | Controlled state in HomeScreen, Start button disabled attribute + aria-disabled |
| R-003 | Test displays a paragraph of words from the selected difficulty pool | generateText.ts samples from wordLists.ts, passes Word[] to TextDisplay |
| R-004 | Timer starts on first printable keypress, not on screen load | useTypingEngine tracks `started` boolean; useCountdown.start() called on first printable key |
| R-005 | Timer counts down from 60 seconds | useCountdown hook with setInterval, TIMER_DURATION=60 constant |
| R-006 | Characters marked correct (green) or incorrect (red) as typed | useTypingEngine char comparison; TextDisplay renders span with state-based CSS class |
| R-007 | Blinking cursor indicates current expected character | CSS border-left on current char span; CSS @keyframes blink animation |
| R-008 | Space advances to next word regardless of current word correctness | useTypingEngine Space key handler increments currentWordIndex |
| R-009 | Backspace deletes last char of current word only, no crossing word boundary | useTypingEngine Backspace handler: guard against currentCharIndex === 0 |
| R-010 | When timer hits zero, test ends and result overlay appears | useCountdown onComplete callback; TypingApp transitions screen to 'result' |
| R-011 | If word list exhausted before timer, test ends immediately | useTypingEngine sets isComplete when currentWordIndex >= words.length; TestScreen calls onFinish |
| R-070 | All interactive elements keyboard navigable | Tab order, arrow keys for DifficultySelector, Enter for Start/Retry/Home |
| R-071 | axe-core scan passes on all three screens | Correct ARIA roles, labels, contrast ratios, focus management |
| R-075 | DifficultySelector uses role="radiogroup" and role="radio" | Container div role="radiogroup" aria-label="Select difficulty"; button divs role="radio" aria-checked |
| R-076 | Hidden input has aria-label | `<input aria-label="Type the displayed text" />` (exact text per ACCESSIBILITY-STANDARDS.md) |
</phase_requirements>

---

## Summary

Phase 1 builds a complete, functional typing test using Next.js 14 App Router with TypeScript strict mode. The stack is fully specified in project standards: no global state library, no routing, screen state managed entirely in TypingApp.tsx. The two core technical challenges are (1) the typing engine — a stateful hook that performs character comparison, word advancement, backspace boundary enforcement, and WPM/accuracy calculation — and (2) the TextDisplay rendering path, which must be memoized to avoid re-rendering every character span on every keypress.

The project has no existing package.json or installed dependencies. Setup starts with `npx create-next-app@latest` with TypeScript + Tailwind + App Router, followed by adding Vitest + React Testing Library + @axe-core/playwright for the test stack. All font loading uses the `variable` prop pattern from `next/font/google` to expose both Press Start 2P and VT323 as CSS custom properties, then those variables are referenced throughout CSS Modules and globals.css.

The typing engine architecture deliberately avoids `useReducer` and uses multiple `useState` values managed by mutation helpers, because the spec calls `useTypingEngine` to own all typing state internally and expose a clean interface. The countdown hook uses `setInterval` in a `useEffect` with proper cleanup, and `useRef` to store the interval ID.

**Primary recommendation:** Follow the build order in CLAUDE.md exactly (types → constants → wordLists → generateText → hooks → components → TypingApp → globals → layout → page). Types and constants first prevents ripple-effect type errors during component construction.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14.x | App Router, SSR/static, dev server | Specified in project requirements |
| TypeScript | 5.x (strict) | Type safety | Specified — zero `any`, zero `@ts-ignore` |
| Tailwind CSS | v3.x | Utility layout, spacing, responsive | Specified — v3, not v4 |
| React | 18.x (bundled with Next) | Component model, hooks | Framework dependency |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | ^1.x | Unit + component test runner | All logic tests for hooks and lib |
| @testing-library/react | ^14.x | Component rendering in tests | Component behavior tests |
| @testing-library/user-event | ^14.x | Simulating real user interactions | Keyboard and click test simulation |
| @testing-library/jest-dom | ^6.x | DOM assertion matchers | toBeInTheDocument, toHaveClass etc. |
| jsdom | ^24.x | Browser DOM environment for Vitest | test.environment in vitest.config.ts |
| @vitejs/plugin-react | ^4.x | React JSX transform for Vitest | Required vitest plugin |
| vite-tsconfig-paths | ^4.x | Resolves tsconfig path aliases | Required for @ imports in tests |
| @playwright/test | ^1.x | E2E browser automation | Full-run and a11y tests |
| @axe-core/playwright | ^4.x | Automated accessibility scanning | axe-core scan on all three screens |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v3 | Tailwind v4 | v4 has different config syntax; spec explicitly calls out v3 |
| CSS Modules | Styled Components / emotion | CSS Modules are framework-agnostic, zero runtime; spec mandates them |
| Vitest | Jest | Vitest is faster, natively ESM-compatible, same API as Jest |
| setInterval in useEffect | useInterval library | Custom hook is simpler and avoids dependency; overreacted.io pattern is well-established |

**Installation:**
```bash
npx create-next-app@latest typing-test --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd typing-test
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom vite-tsconfig-paths
npm install -D @playwright/test @axe-core/playwright
npx playwright install
```

---

## Architecture Patterns

### Recommended Project Structure

```
typing-test/
├── app/
│   ├── globals.css         # Tailwind directives, CSS custom properties, CRT overlay
│   ├── layout.tsx          # next/font/google imports, root HTML/body with font vars
│   └── page.tsx            # Renders <TypingApp /> only
├── components/
│   ├── TypingApp.tsx        # Root state machine: screen, difficulty, result
│   ├── DifficultySelector/
│   │   ├── index.tsx
│   │   └── DifficultySelector.module.css
│   ├── HomeScreen/
│   │   ├── index.tsx
│   │   └── HomeScreen.module.css
│   ├── TestScreen/
│   │   ├── index.tsx
│   │   └── TestScreen.module.css
│   ├── TextDisplay/
│   │   ├── index.tsx
│   │   └── TextDisplay.module.css
│   ├── StatsBar/
│   │   ├── index.tsx
│   │   └── StatsBar.module.css
│   └── ResultOverlay/
│       ├── index.tsx
│       └── ResultOverlay.module.css
├── hooks/
│   ├── useTypingEngine.ts
│   ├── useCountdown.ts
│   └── useKeystrokeSound.ts   # stub only in Phase 1
├── lib/
│   ├── constants.ts
│   ├── wordLists.ts
│   └── generateText.ts
└── types/
    └── index.ts
```

### Pattern 1: Google Font CSS Variables (Two Fonts)

**What:** Use `variable` prop in `next/font/google` to expose fonts as CSS custom properties. Apply both variable classNames to `<html>`. Reference via `var()` in CSS Modules and globals.css.

**When to use:** Any time two or more fonts are needed globally across all components.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font#css-variables
// app/layout.tsx
import { Press_Start_2P, VT323 } from 'next/font/google'

const pressStart2P = Press_Start_2P({
  weight: '400',          // Press Start 2P is not a variable font — weight required
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
})

const vt323 = VT323({
  weight: '400',          // VT323 is not a variable font — weight required
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${vt323.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

Then in CSS Modules:
```css
/* Any ComponentName.module.css */
.label {
  font-family: var(--font-press-start);
}
.displayText {
  font-family: var(--font-vt323);
}
```

**Important:** Press Start 2P and VT323 are NOT variable fonts. Always specify `weight: '400'`. Import names with underscores: `Press_Start_2P`, `VT323`.

### Pattern 2: useCountdown Hook

**What:** A custom hook that manages a countdown timer with `setInterval`. Exposes `start()`, `reset()`, `timeLeft`, and fires `onComplete` callback at zero.

**When to use:** TestScreen mounts this and wires to useTypingEngine's `started` flag.

**Example:**
```typescript
// hooks/useCountdown.ts
import { useState, useRef, useCallback } from 'react'
import { TIMER_DURATION } from '@/lib/constants'

interface UseCountdownOptions {
  onComplete: () => void
}

interface UseCountdownReturn {
  timeLeft: number
  start: () => void
  reset: () => void
}

export function useCountdown({ onComplete }: UseCountdownOptions): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete  // keep callback ref current

  const start = useCallback(() => {
    if (intervalRef.current) return  // already running
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          onCompleteRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTimeLeft(TIMER_DURATION)
  }, [])

  return { timeLeft, start, reset }
}
```

**Critical pitfall:** Always use `useRef` for the interval ID, not state. Store the `onComplete` callback in a ref (not dependency array) to avoid re-creating the interval on every render.

### Pattern 3: useTypingEngine Hook

**What:** The core typing engine. Manages the full `TestState`-like structure — `words`, `currentWordIndex`, `currentCharIndex`, `correctChars`, `incorrectChars`, `totalTypedChars`, `started`, `finished`. Exposes a `handleKey(key: string)` dispatcher.

**When to use:** TestScreen calls `handleKey` from the hidden input's `onKeyDown` event.

**Example (key handler structure):**
```typescript
// hooks/useTypingEngine.ts — key handler logic
const handleKey = useCallback((key: string) => {
  if (finished) return

  // Backspace: delete last char of current word, never cross boundary
  if (key === 'Backspace') {
    if (currentCharIndex > 0) {
      setCurrentCharIndex(i => i - 1)
      // reset char state at currentCharIndex - 1
    }
    return
  }

  // Space: advance word regardless of correctness
  if (key === ' ') {
    if (!started) return  // space before first char does NOT start timer
    // lock current word, advance word index, reset char index
    return
  }

  // Printable character: single char, start timer on first
  if (key.length === 1) {
    if (!started) {
      setStarted(true)
      onStart()  // signals useCountdown.start()
    }
    // compare key against expected char, mark correct or incorrect
    // increment counts, advance currentCharIndex
  }
}, [finished, started, currentCharIndex, ...])
```

**Important:** `key.length === 1` correctly filters printable chars vs. modifier keys (Tab, Shift, Ctrl, Alt all have `.length > 1`). Space has `.length === 1` but is handled as a special case before this check.

### Pattern 4: TextDisplay Memoization

**What:** Character spans must not re-render the full list on every keypress. Use `React.memo` on a `WordSpan` sub-component and `useMemo` on the word array passed down.

**When to use:** TextDisplay receives `words`, `currentWordIndex`, `currentCharIndex` as props. Without memoization, every keypress re-renders hundreds of `<span>` elements.

**Example:**
```typescript
// components/TextDisplay/index.tsx
import React, { memo } from 'react'

interface CharSpanProps {
  char: Char
  isCursor: boolean
}

const CharSpan = memo(function CharSpan({ char, isCursor }: CharSpanProps) {
  return (
    <span
      className={`${styles.char} ${styles[char.state]} ${isCursor ? styles.cursor : ''}`}
    >
      {char.expected}
    </span>
  )
})

interface WordSpanProps {
  word: Word
  isActive: boolean
  wordIndex: number
  currentCharIndex: number
}

const WordSpan = memo(function WordSpan({ word, isActive, wordIndex, currentCharIndex }: WordSpanProps) {
  return (
    <span className={`${styles.word} ${isActive ? styles.active : ''} ${word.state === 'incorrect' ? styles.wrongWord : ''}`}>
      {word.chars.map((char, charIndex) => (
        <CharSpan
          key={charIndex}
          char={char}
          isCursor={isActive && charIndex === currentCharIndex}
        />
      ))}
      {/* space after word */}
      <span className={styles.space}>{' '}</span>
    </span>
  )
})
```

**Global standards note:** GLOBAL-STANDARDS.md explicitly states "Memoize character state in TextDisplay — do not re-render entire list on every keypress."

### Pattern 5: Hidden Input Keyboard Capture

**What:** A visually hidden `<input>` element that receives all keyboard events during the test. Auto-focused on mount via `autoFocus` prop and ref. Re-focused on any click of the TestScreen.

**Example:**
```typescript
// components/TestScreen/index.tsx
import { useRef, useEffect, useCallback } from 'react'

const inputRef = useRef<HTMLInputElement>(null)

// Re-focus on any click
const handleContainerClick = useCallback(() => {
  inputRef.current?.focus()
}, [])

// onKeyDown captures the raw key
const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
  e.preventDefault()          // prevent default browser behavior (e.g. scrolling on Space)
  handleKey(e.key)            // dispatch to useTypingEngine
}, [handleKey])

return (
  <div onClick={handleContainerClick}>
    <input
      ref={inputRef}
      autoFocus
      aria-label="Type the displayed text"
      className={styles.hiddenInput}  // visually hidden, not display:none
      onKeyDown={handleKeyDown}
      value=""                // controlled — value always empty, state lives in hook
      onChange={() => {}}     // suppress React controlled input warning
      readOnly={false}
    />
    {/* rest of TestScreen */}
  </div>
)
```

**CSS to hide input without removing from tab order:**
```css
/* TestScreen.module.css */
.hiddenInput {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
```

### Pattern 6: CSS Blink Animation (No JS)

**What:** CSS `@keyframes` with `animation` property for both the title block cursor and the TextDisplay caret.

**Example:**
```css
/* In globals.css or relevant .module.css */
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Title block cursor (600ms per SCREENS.md) */
.titleCursor {
  display: inline-block;
  color: var(--color-amber);
  animation: blink 600ms step-end infinite;
}

/* TextDisplay character cursor (500ms per SCREENS.md) */
.cursor {
  border-left: 2px solid var(--color-amber);
  animation: blink 500ms step-end infinite;
}
```

**Why `step-end`:** Sharp on/off blink (terminal aesthetic). Not `linear` or `ease-in-out` which produces a gradual fade.

### Pattern 7: DifficultySelector ARIA Radiogroup

**What:** The difficulty buttons implement the ARIA radiogroup pattern with keyboard navigation (arrow keys cycle options, Enter/Space selects).

**Example:**
```typescript
// components/DifficultySelector/index.tsx
<div
  role="radiogroup"
  aria-label="Select difficulty"
  onKeyDown={handleArrowKeys}
>
  {difficulties.map((diff) => (
    <div
      key={diff.value}
      role="radio"
      aria-checked={selected === diff.value}
      aria-label={`${diff.label}, ${diff.descriptor}`}
      tabIndex={selected === diff.value ? 0 : -1}  // roving tabindex
      onClick={() => onChange(diff.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onChange(diff.value)
        }
      }}
      className={`${styles.option} ${selected === diff.value ? styles.selected : ''}`}
    >
      <span className={styles.label}>{diff.label}</span>
      <span className={styles.descriptor}>{diff.descriptor}</span>
    </div>
  ))}
</div>
```

**Roving tabindex:** Only the selected (or first) option has `tabIndex={0}`. All others have `tabIndex={-1}`. Arrow keys move focus and update selection.

### Anti-Patterns to Avoid

- **display: none on StatsBar:** Causes layout shift when it becomes visible. Always use `opacity: 0` + `pointer-events: none`.
- **Inline animation variants in JSX:** GLOBAL-STANDARDS.md prohibits this. Even though Phase 1 has no Framer Motion, establish the pattern now with CSS constants.
- **AudioContext on component mount:** Don't create it yet; stub useKeystrokeSound to return empty functions.
- **Magic numbers in components:** All durations, sizes, thresholds go in `lib/constants.ts`.
- **`onChange` on input without `value`:** React will warn. Either fully controlled (value + onChange) or uncontrolled (no value). Use controlled with `value=""` and `onChange={() => {}}`.
- **Mutating Word/Char objects directly:** Always produce new arrays/objects for state updates; direct mutation won't trigger re-renders.
- **`e.key` vs `e.code`:** Use `e.key` for character comparison. `e.code` is physical key position (layout-dependent). `e.key` gives the actual character.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading + self-hosting | Custom @font-face in CSS | `next/font/google` | Zero layout shift guarantee, auto self-hosting, no Google requests at runtime |
| Test environment DOM | Manual DOM setup | jsdom via Vitest config | Vitest's `environment: 'jsdom'` handles all browser API stubs |
| Accessibility scanning | Manual ARIA checks | @axe-core/playwright | Catches violations a human reviewer misses; required by project standards |
| CSS variable theming | Inline styles or JS theme context | CSS custom properties in globals.css | Zero runtime cost, works with CSS Modules, no React re-renders for theme values |
| Interval management | Manual counter with Date.now() | setInterval in useEffect with useRef cleanup | Proven pattern; Date.now() drift approach is complex and unnecessary for 60s timer |

**Key insight:** The spec is so complete that almost nothing requires creative problem-solving — the risk is in deviating from the spec, not in solving unknown problems.

---

## Common Pitfalls

### Pitfall 1: Stale Closure in setInterval

**What goes wrong:** `onComplete` callback or `timeLeft` inside `setInterval` captures stale values from the initial render and never updates.

**Why it happens:** JavaScript closures capture variables by reference at the time the closure is created. `setInterval`'s callback closes over the initial render's values.

**How to avoid:** Store `onComplete` in a `useRef` and read `onCompleteRef.current` inside the interval callback. Use the functional updater form of `setTimeLeft(prev => prev - 1)` to avoid depending on `timeLeft` directly.

**Warning signs:** Timer appears to work but `onComplete` fires with wrong WPM, or timer goes below 0 without stopping.

### Pitfall 2: Re-rendering All Character Spans on Every Keypress

**What goes wrong:** Without `React.memo` on `WordSpan` and `CharSpan`, every keypress re-renders all 80+ words worth of character spans (~500–2000 DOM updates), causing visible lag at high typing speeds.

**Why it happens:** Parent state changes propagate down to all children. Without memoization, React re-renders all child components.

**How to avoid:** Wrap `WordSpan` and `CharSpan` in `React.memo`. Pass only the specific word/char data each component needs. The `isCursor` boolean should be computed at the CharSpan level, not passed from the top.

**Warning signs:** High CPU usage during typing, visible frame drops, delay between keypress and character appearing.

### Pitfall 3: Press Start 2P Weight Omission

**What goes wrong:** `next/font/google` throws a build error or silently falls back to system font because `weight` is not specified for non-variable fonts.

**Why it happens:** Press Start 2P and VT323 are not variable fonts. `next/font/google` requires explicit `weight` for non-variable fonts.

**How to avoid:** Always include `weight: '400'` for both fonts. Use exact import names: `Press_Start_2P` and `VT323` (underscores for spaces).

**Warning signs:** Build error "Please specify weight for non-variable font" or font not loading in browser.

### Pitfall 4: Space Key Starting the Timer

**What goes wrong:** Timer starts when user presses Space before typing anything, violating R-004.

**Why it happens:** `key.length === 1` is true for Space. If the printable-char branch doesn't check `key !== ' '` first, Space triggers `setStarted(true)`.

**How to avoid:** Handle Space BEFORE the printable character check. If `!started` and key is Space, return immediately.

**Warning signs:** Timer starts at 0 keystrokes; WPM calculation is off by the time of the Space press.

### Pitfall 5: Backspace Crossing Word Boundary

**What goes wrong:** Backspace at the start of a word deletes the previous word's last character (wrong behavior per R-009).

**Why it happens:** The handler decrements `currentCharIndex` or `currentWordIndex` without checking the boundary condition.

**How to avoid:** Guard: `if (currentCharIndex === 0) return` — do nothing when at the start of a word. Never decrement `currentWordIndex` in the Backspace handler.

**Warning signs:** User can erase previous words; test fails spec requirement R-009.

### Pitfall 6: axe-core Failures from Contrast on Dim Color

**What goes wrong:** axe-core reports a contrast violation for `--color-text-dim: #444444` on `--color-bg: #0a0a0a` (1.8:1 ratio, fails WCAG AA).

**Why it happens:** The dim color intentionally fails AA — it's used for untyped characters that are not interactive.

**How to avoid:** The ACCESSIBILITY-STANDARDS.md explicitly documents this exception. Add a code comment at every usage of `--color-text-dim`: `/* contrast 1.8:1 — intentional; untyped chars are non-interactive, state communicated by cursor position */`. Verify axe-core ignores this if non-interactive elements are excluded. If axe-core still flags it, configure the axe rule to ignore it specifically.

**Warning signs:** axe-core fails only on TestScreen with a color-contrast violation on character spans.

### Pitfall 7: `value=""` and Controlled Input Warning

**What goes wrong:** React warns "A component is changing an uncontrolled input to be controlled" or vice versa.

**Why it happens:** The hidden input must stay empty (no text accumulates), but React requires either fully controlled or fully uncontrolled inputs.

**How to avoid:** Fully controlled: `value=""` + `onChange={() => {}}`. This suppresses the warning. All real input is captured via `onKeyDown`, not `onChange`.

### Pitfall 8: Word State Array Mutation

**What goes wrong:** Typing updates don't trigger re-renders because the same array/object reference is mutated in place.

**Why it happens:** Direct mutation (e.g., `words[i].chars[j].state = 'correct'`) doesn't change the reference, so React sees no state change.

**How to avoid:** Always create new arrays: `setWords(prev => prev.map((w, wi) => wi === currentWordIndex ? { ...w, chars: w.chars.map(...) } : w))`. This is O(n) on words but called only once per keypress; acceptable.

---

## Code Examples

Verified patterns from official sources and project standards:

### globals.css Structure

```css
/* Source: project DESIGN-SYSTEM.md + Tailwind CSS docs */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-amber: #ffb000;
  --color-amber-dim: #7a5500;
  --color-blue: #00aaff;
  --color-blue-dim: #004466;
  --color-green-correct: #39ff14;
  --color-red-wrong: #ff3333;
  --color-text-dim: #444444;
  --color-white: #f0f0f0;
}

/* CRT scanlines */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent, transparent 2px,
    rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
  );
}

/* CRT vignette */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%);
}

body {
  background-color: var(--color-bg);
  color: var(--color-white);
}
```

### vitest.config.ts

```typescript
// Source: https://nextjs.org/docs/app/guides/testing/vitest
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
```

### WPM Formula

```typescript
// Source: project SCREENS.md
// Formula: (correctChars / 5) / (elapsedSeconds / 60)
// Standard typing test convention: 5 chars = 1 word
function calculateWPM(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0
  return Math.round((correctChars / 5) / (elapsedSeconds / 60))
}

// Accuracy formula
function calculateAccuracy(correctChars: number, totalTypedChars: number): number {
  if (totalTypedChars === 0) return 0
  return Math.round((correctChars / totalTypedChars) * 100)
}
```

### types/index.ts (exact shape from SCREENS.md)

```typescript
// Source: project SCREENS.md State Shape section
export type Screen = 'home' | 'test' | 'result'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type CharState = 'untyped' | 'correct' | 'incorrect'
export type WordState = 'untyped' | 'active' | 'correct' | 'incorrect'

export interface AppState {
  screen: Screen
  difficulty: Difficulty | null
}

export interface Char {
  expected: string
  typed: string | null
  state: CharState
}

export interface Word {
  chars: Char[]
  state: WordState
}

export interface TestState {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
  started: boolean
  finished: boolean
  timeLeft: number
  correctChars: number
  incorrectChars: number
  totalTypedChars: number
  activeKey: string | null
  capsLockOn: boolean
  quitting: boolean
}

export interface ResultState {
  wpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
}
```

### generateText.ts Pattern

```typescript
// lib/generateText.ts
import { WORDS_PER_TEST } from './constants'
import { wordLists } from './wordLists'
import type { Word, Char, Difficulty } from '@/types'

export function generateText(difficulty: Difficulty): Word[] {
  const pool = wordLists[difficulty]
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, WORDS_PER_TEST)

  return selected.map((word): Word => ({
    state: 'untyped',
    chars: word.split('').map((char): Char => ({
      expected: char,
      typed: null,
      state: 'untyped',
    })),
  }))
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@next/font` package | `next/font` built into Next.js | Next.js 13.2 | No separate install needed; `next/font/google` works out of the box |
| Pages Router | App Router | Next.js 13 (stable 13.4) | `app/layout.tsx` replaces `_document.tsx`; font vars on `<html>` tag |
| Jest + Babel | Vitest | Community shift 2023–2024 | Faster, native ESM, no Babel config needed for Next.js |
| Tailwind v4 config changes | Tailwind v3 for this project | N/A | Project explicitly targets v3; v4 uses different `@import 'tailwindcss'` syntax; stick with v3 |

**Deprecated/outdated:**
- `@next/font` (the separate package): replaced by `next/font` in Next.js 13.2. Do not install `@next/font` separately.
- `pages/_document.tsx` for font injection: App Router uses `app/layout.tsx` instead.
- `jest.config.js` with babel-jest: Vitest is the specified test runner; no Jest config needed.

---

## Open Questions

1. **axe-core and dim color contrast**
   - What we know: `--color-text-dim: #444444` on `#0a0a0a` is 1.8:1 and intentionally fails WCAG AA
   - What's unclear: Whether axe-core's scan will flag this on non-interactive elements (it often skips non-interactive text), or whether a specific axe rule disable is needed
   - Recommendation: Proceed with implementation. Run axe-core during testing and add a targeted rule disable if needed, documenting the intentional exception per ACCESSIBILITY-STANDARDS.md

2. **WORDS_PER_TEST exact value**
   - What we know: Claude's discretion; must be 60–100 words; must outlast 60s for the fastest typist
   - What's unclear: Optimal balance between memory footprint and buffer safety
   - Recommendation: Use 80. A world-record typist (~216 WPM) would type ~216 words in 60s — but that's unreachable; 80 covers realistic fast typists at ~100 WPM (100 words/min = 100 words in 60s, but only correctly-typed words). 80 is the spec's suggested value and provides a comfortable buffer.

3. **`cursor` state on last char of last word**
   - What we know: Cursor sits at `currentCharIndex` of `currentWordIndex`; when all words are typed, `isComplete = true`
   - What's unclear: What happens visually to the cursor when `isComplete` — the overlay appears, so it doesn't matter much
   - Recommendation: When `finished = true`, disable input and let `isComplete` trigger `onFinish`. The overlay covers the cursor.

---

## Sources

### Primary (HIGH confidence)

- Next.js official docs (https://nextjs.org/docs/app/api-reference/components/font) — font loading, `variable` prop, multiple fonts, CSS variable pattern. Verified current as of lastUpdated: 2026-02-27.
- Next.js official docs (https://nextjs.org/docs/app/guides/testing/vitest) — Vitest setup with Next.js App Router
- Project SCREENS.md — state shape, interaction spec, exact CSS values. Authoritative for this project.
- Project CLAUDE.md + standards/ files — architecture rules, CSS conventions, testing requirements. Authoritative.

### Secondary (MEDIUM confidence)

- WebSearch: Vitest config + React Testing Library setup pattern — consistent across multiple official and community sources; matches TESTING-STANDARDS.md spec
- WebSearch: CSS keyframe blink animation — standard CSS pattern, well-established, browser-compatible
- WebSearch: useReducer vs useState for complex state — community consensus consistent with React official docs

### Tertiary (LOW confidence)

- None — all critical findings verified against official sources or project spec.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — fully specified in project files, no ambiguity
- Architecture: HIGH — specified to file-level detail in ARCHITECTURE-STANDARDS.md and SCREENS.md
- Typing engine patterns: HIGH — derived from spec requirements with clear algorithmic paths
- Font loading: HIGH — verified against current Next.js official docs (2026-02-27)
- Pitfalls: HIGH — derived from spec requirements + standard React patterns

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (Next.js and React APIs are stable; spec is fixed)
