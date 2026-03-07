# UI Change Plan — Phase 4
# File: .planning/phases/04-ui-polish/PLAN.md
# Do not touch hooks, game logic, TypeScript types, or word lists.
# These are pure UI/component changes.

---

## Scope

4 changes. All CSS and component level only.

1. Moving pixel star background (global)
2. Home screen difficulty cards redesign
3. Test screen container + stats bar redesign + remove sound toggle
4. Result overlay retro game-over style

---

## Change 1: Moving Pixel Star Background

### Component
Create: components/StarField/StarField.tsx
Create: components/StarField/StarField.module.css
Add to: components/TypingApp.tsx (renders behind all screens)

### Behavior
- Canvas element or pure CSS — use CSS animation approach (no canvas, simpler and performant)
- 3 layers of stars at different speeds and sizes — parallax depth effect
- Layer 1 (far): 60 stars, 1px, opacity 0.3, slow scroll (120s loop)
- Layer 2 (mid): 35 stars, 1–2px, opacity 0.5, medium scroll (80s loop)
- Layer 3 (near): 15 stars, 2px, opacity 0.7, faster scroll (50s loop)
- All stars are square (pixel aesthetic — no border-radius)
- Stars move top to bottom (classic space feel)
- Stars generated via CSS box-shadow on a single div per layer (no DOM nodes per star)
- Colors: mix of white (#ffffff), dim blue (#00aaff at 40% opacity), dim amber (#ffb000 at 30% opacity)
- Position: fixed, inset 0, z-index 0 (behind all screen content)
- All screen content sits at z-index 1 or above

### CSS box-shadow star pattern (per layer div)
Each div is 1px × 1px. Stars are box-shadows at random x/y positions.
Animation scrolls the div from translateY(0) to translateY(100vh), then resets.
Use @keyframes scroll-stars with 0% at transform: translateY(0) and 100% at transform: translateY(100vh).

### Subtlety rule
Total visual weight must not distract from the typing text.
If any star layer feels busy during the test screen, reduce opacity further.
The CRT overlay already sits on top — stars show through it slightly.

---

## Change 2: Home Screen Difficulty Cards

### Files to modify
components/DifficultySelector/DifficultySelector.tsx
components/DifficultySelector/DifficultySelector.module.css

### Layout change
FROM: vertical stack of 3 buttons
TO: horizontal row of 3 equal-width cards

Container: display flex, flex-direction row, gap 20px, justify-content center
Each card: flex 1, max-width 220px, min-height 160px

### Card anatomy (top to bottom inside each card)

```
┌─────────────────────────┐
│  [ EASY ]               │  ← difficulty label, Press Start 2P, 12px, amber
│                         │
│  200 common words       │  ← descriptor, VT323, 18px, amber-dim
│                         │
│  SPEED ████░░░░░░ 20%   │  ← removed per spec — NO STAT BAR
└─────────────────────────┘
```

No stat bar. No icons. Just label + descriptor.

### Pixel-art border
Use CSS box-shadow to create a chunky pixel frame:
  border: 2px solid var(--color-amber-dim)
  box-shadow:
    0 0 0 2px var(--color-bg),
    0 0 0 4px var(--color-amber-dim)
  (creates a double-border pixel frame effect)

border-radius: 0 (hard corners, pixel aesthetic)

### States

Default:
  border: 2px solid var(--color-amber-dim)
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-amber-dim)
  background: transparent
  color: var(--color-amber-dim)

Hover:
  border-color: var(--color-amber)
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-amber), 0 0 12px rgba(255,176,0,0.3)
  background: rgba(255,176,0,0.05)
  color: var(--color-amber)
  cursor: pointer
  transition: all 150ms

Selected:
  border-color: var(--color-amber)
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-amber), 0 0 16px rgba(180,100,0,0.5)
  background: rgba(180, 100, 0, 0.35)   ← AMBER tint, NOT blue
  color: var(--color-amber)

### data-testid attributes
  Container: data-testid="difficulty-selector"
  Easy card: data-testid="difficulty-easy"
  Medium card: data-testid="difficulty-medium"
  Hard card: data-testid="difficulty-hard"

### Framer Motion
  Each card: whileHover scale 1.03, whileTap scale 0.97
  On select: brief scale 1.05 then back to 1.0 (spring, stiffness 400 damping 20)

---

## Change 3: Test Screen Container + Stats Redesign + Remove Sound

### Files to modify
components/TestScreen/TestScreen.tsx
components/TestScreen/TestScreen.module.css
components/StatsBar/StatsBar.tsx
components/StatsBar/StatsBar.module.css
Delete or comment out: all sound toggle UI, sound toggle state, sound toggle handlers
  (keep useKeystrokeSound hook — sound stays on, just remove the button)

### Outer container
Wrap all test screen content in a single container div:
  max-width: 900px
  width: 100%
  margin: 0 auto
  border: 1px solid var(--color-amber-dim)
  background: var(--color-surface)
  padding: 0   ← no padding on container itself, sections have their own padding

### Stats bar (top section of container)

Layout: 3 equal columns in a row
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  border-bottom: 1px solid var(--color-amber-dim)

Each column:
  padding: 16px 0
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  text-align: center

Dividers between columns:
  Middle column: border-left: 1px solid var(--color-amber-dim), border-right: 1px solid var(--color-amber-dim)

Column content:
  Label (top): Press Start 2P, 8px, var(--color-amber-dim), letter-spacing 0.05em
  Value (bottom): VT323, 48px, value-specific color (see below)

Value colors:
  WPM: var(--color-amber)
  TIME: var(--color-blue) → var(--color-red-wrong) when timeLeft ≤ 10
  ACC: var(--color-white)

CRITICAL — fixed sizing to prevent layout shift:
  Each value cell: min-width 120px, text-align center
  VT323 at 48px: character width is consistent — "000" and "100%" should not shift layout
  Use tabular-nums font-variant on the value spans

### Text display section (below stats)
  padding: 32px 40px
  The TextDisplay component renders here unchanged

### Escape hint (bottom of container)
  padding: 12px
  border-top: 1px solid var(--color-amber-dim)
  text-align: center

### Remove sound toggle
  Delete the sound on/off button from TestScreen
  Delete any toggle state (soundEnabled, setSoundEnabled) in TestScreen
  Keep useKeystrokeSound() — just call it without a toggle
  playCorrect and playWrong always fire on keypress

### data-testid attributes
  Container: data-testid="test-container"
  Stats bar: data-testid="stats-bar"
  WPM value: data-testid="stat-wpm"
  TIME value: data-testid="stat-time"
  ACC value: data-testid="stat-acc"
  Text display area: data-testid="text-display"

---

## Change 4: Result Overlay — Retro Game-Over Style

Reference: Image showing GAME OVER screen with pixel text, play again prompt, YES/NO buttons

### Files to modify
components/ResultOverlay/ResultOverlay.tsx
components/ResultOverlay/ResultOverlay.module.css

### Visual direction
The overlay should feel like a retro game end screen.
Amber and blue — our palette. No new colors.
Pixel borders on the modal. Hard corners. Chunky feel.

### Modal structure (top to bottom)

```
┌══════════════════════════════════┐  ← outer pixel border (double border trick)
║                                  ║
║      T E S T   C O M P L E T E  ║  ← spaced letters, Press Start 2P, amber, large
║                                  ║
║  ┌────────┐      ┌────────────┐  ║
║  │  142   │      │    96%     │  ║  ← WPM (amber, 96px VT323) | ACC (blue, 72px VT323)
║  │  WPM   │      │  ACCURACY  │  ║
║  └────────┘      └────────────┘  ║
║                                  ║
║      568 correct · 23 wrong      ║  ← VT323 24px
║                                  ║
║  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  ║  ← dashed amber divider
║                                  ║
║         PLAY AGAIN?              ║  ← VT323, amber-dim, 24px (reference text)
║                                  ║
║      [ RETRY ]    [ HOME ]       ║  ← same button style as home screen cards
║                                  ║
└══════════════════════════════════┘
```

### Pixel border on modal
  border: 2px solid var(--color-amber)
  box-shadow:
    0 0 0 2px var(--color-bg),
    0 0 0 4px var(--color-amber),
    0 0 32px rgba(255,176,0,0.2)
  border-radius: 0
  background: var(--color-surface)
  max-width: 520px
  padding: 48px 40px

### "PLAY AGAIN?" text
  VT323, 24px, var(--color-amber-dim)
  Letter-spaced
  Sits between the dashed divider and the buttons
  Not a button — decorative prompt text like the reference image

### Dashed divider
  border-top: 1px dashed var(--color-amber-dim)
  width: 80%
  margin: 0 auto

### WPM and ACC stat boxes
  Each sits in a bordered box:
    border: 1px solid var(--color-amber-dim)
    padding: 16px 24px
    text-align: center
  Two boxes side by side: display flex, gap 20px, justify-content center

### Backdrop
  background: rgba(0,0,0,0.9) — slightly darker than current for drama
  backdrop-filter: blur(2px) — subtle depth

### Animations (Framer Motion)
  Backdrop: opacity 0 to 1, 200ms
  Modal: scale 0.8 to 1.0, opacity 0 to 1, spring stiffness 280 damping 22
  "TEST COMPLETE" text: character reveal, 30ms per character (already specced — keep it)
  Stat boxes: stagger fade-in after header reveal (each box 80ms apart)
  "PLAY AGAIN?" text: fade in after stat boxes
  Buttons: fade in last
  WPM/ACC count-up: unchanged from Phase 2 spec

### Buttons (RETRY and HOME)
  Same pixel-art card style as difficulty cards
  Pixel border, amber, hard corners
  Sit side by side, equal width, centered

### data-testid attributes
  Backdrop: data-testid="result-backdrop"
  Modal: data-testid="result-modal"
  WPM value: data-testid="result-wpm"
  ACC value: data-testid="result-acc"
  Char breakdown: data-testid="result-chars"
  Retry button: data-testid="retry-button"
  Home button: data-testid="home-button"

---

## Implementation Order (Claude Code should follow this)

1. StarField component (no dependencies)
2. Add StarField to TypingApp.tsx behind AnimatePresence
3. DifficultySelector redesign (cards, horizontal, amber selected)
4. Remove sound toggle from TestScreen
5. TestScreen container wrapper
6. StatsBar redesign (3-column grid with dividers)
7. ResultOverlay retro redesign
8. Add all data-testid attributes across all modified components
9. Verify no layout shift on StatsBar (opacity:0 pattern preserved)
10. Verify sound still plays (useKeystrokeSound still called)

---

## What Must Not Change

- useTypingEngine — no changes
- useCountdown — no changes
- useKeystrokeSound — no changes (sound always on, just remove the UI toggle)
- lib/wordLists.ts — no changes
- lib/generateText.ts — no changes
- types/index.ts — no changes
- All game logic behavior
- TextDisplay character rendering
- Screen transition logic in TypingApp.tsx (only add StarField behind it)
