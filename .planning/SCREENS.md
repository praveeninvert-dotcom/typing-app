# Retro Typing Test — Screen & Interaction Spec

---

## Global Behavior

### Focus
- The entire app lives in a single browser tab. There is no routing.
- A hidden `<input>` captures all keystrokes during the test. It is always focused while on the Test screen.
- Clicking anywhere on the Test screen re-focuses the input silently.

### Fonts
- `Press Start 2P` — UI labels, headers, buttons, stats labels
- `VT323` — typing text display, large numbers, result values

### CRT Overlay
- Applied globally via `body::after` — scanlines + vignette
- Never interacts with pointer events
- Always visible across all screens

### Transitions between screens
- All screen transitions use Framer Motion `AnimatePresence`
- Outgoing screen: fade out + slight scale down (0.1s)
- Incoming screen: fade in + slide up from 12px below (0.2s)
- No transition is skippable — duration is short enough that skipping is unnecessary

---

## Screen 1 — Home

### Purpose
Entry point. User picks difficulty and starts the test.

### Layout
Vertically and horizontally centered. Single column. No scrolling.

```
[TYPING.EXE]          ← title
[SELECT DIFFICULTY]   ← subtitle
[ EASY   ]            ← button
[ MEDIUM ]            ← button
[ HARD   ]            ← button
[ START  ]            ← CTA button (disabled until difficulty selected)
```

---

### Elements

#### Title — `TYPING.EXE`
- Font: `Press Start 2P`, large (clamp between 24px–40px)
- Color: amber (`--color-amber`)
- Followed by a blinking block cursor (`█`)
  - Cursor blinks at 600ms interval (CSS animation, not JS)
  - Cursor color: amber
- No interaction

#### Subtitle — `SELECT DIFFICULTY`
- Font: `Press Start 2P`, small (12px)
- Color: dim amber (`--color-amber-dim`)
- Static, no interaction

#### Difficulty Buttons — EASY / MEDIUM / HARD
Each button is a block-level element showing:
- **Line 1:** Difficulty label (`EASY`, `MEDIUM`, `HARD`) — `Press Start 2P`, 12px
- **Line 2:** Descriptor — `VT323`, 18px, dim color
  - EASY: `"200 common words"`
  - MEDIUM: `"500 words + punctuation"`
  - HARD: `"1000 words + numbers + symbols"`

**States:**

| State | Border | Text | Background |
|---|---|---|---|
| Default | 1px dim amber | Dim amber | Transparent |
| Hover | 1px bright amber | Bright amber | Slight amber tint (5% opacity) |
| Selected | 2px bright amber | Bright amber | Blue tint (10% opacity) |
| Other (when one is selected) | 1px dim amber | Dim amber | Transparent |

- Only one difficulty can be selected at a time
- Selecting a new one deselects the previous — no toggle off
- Keyboard navigable (arrow keys cycle through, Enter selects)

#### Start Button — `[ START ]`
- Font: `Press Start 2P`, 14px
- Width: matches difficulty buttons

**States:**

| State | Style |
|---|---|
| Disabled (no difficulty selected) | Dim, no hover effect, `cursor: not-allowed` |
| Enabled | Amber border, amber text, hover brightens |
| Pressed | Scale 0.95, amber background flash, then screen transition |

- Pressing Enter when Start is enabled triggers the same action as clicking

---

### Animations — Home Screen

| Element | Animation | Trigger |
|---|---|---|
| Title | Fade in + slide down from -8px | Page mount |
| Subtitle | Fade in, 100ms delay after title | Page mount |
| Difficulty buttons | Staggered fade in (60ms between each) | Page mount |
| Start button | Fade in after all buttons | Page mount |
| Title cursor | Blink loop (CSS) | Always |
| Difficulty select | Selected button: scale 1.02 pulse once, underline slides in from left | On select |
| Previous selection | Fades border/text back to dim (150ms) | On deselect |
| Start button (enabled) | Scale 1.0 → 1.02 → 1.0 pulse once | On becoming enabled |
| Start button press | Scale down to 0.95 + amber glow burst, hold 80ms, then screen exits | On click/Enter |

---

### Edge Cases — Home Screen

| Scenario | Behavior |
|---|---|
| User presses Enter before selecting difficulty | Nothing happens. Start button remains disabled. |
| User presses Enter to select a difficulty | Focuses the Start button (does not trigger start) |
| User arrives back at Home after a test | All difficulty buttons reset to unselected. Previous difficulty is NOT remembered. |
| Viewport too narrow to show all buttons | Buttons shrink via clamp, layout stays single-column, no horizontal scroll |

---

## Screen 2 — Test

### Purpose
The active typing test. Captures input, renders text state, shows live stats, handles test completion.

### Layout
```
[  WPM: ___   TIME: 60   ACC: __% ]   ← StatsBar (hidden until first keypress)
[                                  ]
[  paragraph of words to type...   ]   ← TextDisplay
[                                  ]
[  CAPS LOCK WARNING (conditional) ]
```

Hidden `<input>` is present in DOM but visually invisible. Always focused.

---

### Elements

#### StatsBar
Three values in a single horizontal row, evenly spaced.

| Slot | Label | Value font | Value color |
|---|---|---|---|
| Left | `WPM` | `VT323` 48px | Amber |
| Center | `TIME` | `VT323` 48px | Blue |
| Right | `ACC` | `VT323` 48px | White |

- Labels in `Press Start 2P` 8px, above each value, dim color
- WPM: recalculates every second. Formula: `(correctChars / 5) / (elapsedSeconds / 60)`
- Accuracy: `Math.round((correctChars / totalTypedChars) * 100)`. Shows `—` until first character typed.
- TIME: counts down from 60. Displays as `60`, `59`, `58`... not `1:00`
- When TIME ≤ 10: value turns red, pulse animation starts (see Animations)
- StatsBar is invisible on screen entry. Animates in on first keypress.

#### TextDisplay
Renders the full test paragraph. Fixed block, does not reflow during the test.

**Character-level rendering:**
Every character is a `<span>` with one of four states:

| State | Color | Additional style |
|---|---|---|
| `untyped` | `--color-text-dim` | None |
| `correct` | `--color-green-correct` | None |
| `incorrect` | `--color-red-wrong` | None |
| `cursor` | `--color-amber` | Blinking left border (the caret) |

- The cursor is a blinking `|` rendered as a `border-left` on the current character span
- Cursor blinks at 500ms (CSS animation, pauses when user is actively typing — see Edge Cases)
- Font: `VT323`, 28px, line-height 2.0 for readability
- Text wraps naturally. No horizontal scroll.
- No font size change on different difficulties

**Word-level rendering:**
- Current word has an amber bottom border (2px)
- Completed incorrect word: retains a dim red background tint permanently for the duration of the test
- No other word-level decoration

**Scrolling behavior:**
- Entire paragraph is rendered up front
- When the active line changes, the TextDisplay scrolls so the active line is always in the vertical center of the container
- Scroll is smooth (`scroll-behavior: smooth` or Framer Motion layout animation)
- User cannot manually scroll

#### Caps Lock Warning
- Shown as a small banner directly below the TextDisplay
- Text: `⚠ CAPS LOCK IS ON`
- Font: `Press Start 2P`, 9px
- Color: red
- Detected via `KeyboardEvent.getModifierState('CapsLock')` on every keydown
- Animates in/out with fade + slight downward slide (150ms)
- Does not block typing — purely informational

#### Escape Hint
- Static text at the bottom of the screen: `[ ESC ] QUIT`
- Font: `Press Start 2P`, 8px
- Color: very dim amber
- Always visible during test, no interaction needed — it's just a label

---

### Typing Behavior

- Hidden `<input type="text">` receives all input
- On each `keydown`:
  - If key is a printable character: compare against expected character
  - If key is `Backspace`: delete last typed character of current word only. Cannot backspace past word boundary.
  - If key is `Space`: advance to next word regardless of whether current word is correct or incorrect. Current word's final state is locked.
  - All other keys (Tab, Shift alone, Ctrl, etc.) are ignored silently
  - `Escape`: triggers quit flow (see Edge Cases)
- Timer starts on the first printable character keypress, not on Space or Backspace
- After timer hits 0, input is immediately disabled. No further characters are accepted.

---

### Animations — Test Screen

| Element | Animation | Trigger |
|---|---|---|
| Screen entry | Fade in + slide up 12px (200ms) | On mount |
| StatsBar | Fade in + slide down from -8px (200ms) | First keypress |
| Cursor blink | CSS animation, 500ms interval | Always while test active |
| Cursor blink pause | Animation paused | While user is actively typing (300ms debounce to resume) |
| Wrong character typed | Current word shakes horizontally: `x: [0, -4, 4, -4, 0]`, 200ms | On incorrect keypress |
| Correct word completed | Word flashes green (opacity 0.6 → 1, 150ms) | On Space after correct word |
| TIME ≤ 10 | Value pulses: scale 1.0 → 1.08 → 1.0 every 1s, color → red | When timeLeft hits 10 |
| TIME = 0 | StatsBar TIME value flashes red 3 times, then Result overlay enters | Timer expiry |
| Active line change | TextDisplay container scrolls smoothly | When cursor moves to new line |

---

### Edge Cases — Test Screen

| Scenario | Behavior |
|---|---|
| User hasn't typed anything | StatsBar hidden. Timer at 60. Cursor blinking. Input focused. Escape hint visible. |
| User types Space as first character | Ignored. Timer does not start. |
| User types Backspace as first character | Ignored. |
| User reaches end of word list before timer expires | Final word is locked. Input is disabled. Result overlay appears immediately (same as timer expiry). |
| Caps Lock detected on keydown | Warning banner fades in. Re-check on every keydown. Fades out when Caps Lock is off. |
| Caps Lock toggled off mid-warning | Warning fades out within 150ms. |
| User presses Escape mid-test | Quit confirmation appears (see below). Test is paused (timer frozen). |
| User clicks outside input | Input is silently re-focused. No visual disruption. |
| User switches browser tab mid-test | Timer continues. No pause mechanic. No warning. |
| User closes/navigates away mid-test | Browser default unload behavior. No custom prompt (keep it simple). |
| Window loses focus mid-test | Timer continues. No pause. |
| Very fast typist finishes all words early | Handled — word list generates enough words (~80) to outlast 60s for any difficulty. |

#### Escape / Quit Flow
1. User presses Escape
2. Timer freezes immediately
3. A small confirmation appears centered on screen (not a full overlay):
   - Text: `QUIT TEST?`
   - Two options: `[ YES ]` and `[ NO ]`
   - Font: `Press Start 2P`
   - Styled same as buttons on Home screen
4. `[ YES ]`: discard test, transition back to Home screen (no result shown)
5. `[ NO ]` or pressing Escape again: dismiss confirmation, timer resumes
6. Confirmation has no timeout — it waits indefinitely

---

## Screen 3 — Result Overlay

### Purpose
Display final stats after test ends. Rendered on top of the frozen Test screen.

### Layout
Modal overlay. Centered. Dark semi-transparent backdrop (`rgba(0,0,0,0.85)`).

```
[ TEST COMPLETE ]       ← header, blinking

  [  142  ]            ← WPM value
   WPM

  [  96%  ]            ← Accuracy
   ACCURACY

  [ 568 correct · 23 incorrect ]  ← character breakdown

  [ RETRY ]   [ HOME ]  ← action buttons
```

---

### Elements

#### Header — `TEST COMPLETE`
- Font: `Press Start 2P`, 14px
- Color: amber
- Blinking: character-by-character reveal animation on entry, then steady blink of the trailing cursor

#### WPM Value
- Font: `VT323`, 96px
- Color: amber
- Count-up animation from 0 to final value over 800ms on mount (easeOut)
- Label `WPM` below in `Press Start 2P` 9px, dim amber

#### Accuracy Value
- Font: `VT323`, 72px
- Color: blue (`--color-blue`)
- Count-up from 0 to final value over 600ms on mount
- Label `ACCURACY` below in `Press Start 2P` 9px, dim blue

#### Character Breakdown
- Single line: `568 correct · 23 incorrect`
- Font: `VT323`, 24px
- Correct count: green (`--color-green-correct`)
- `·` separator: dim white
- Incorrect count: red (`--color-red-wrong`)
- Fades in 200ms after accuracy finishes counting

#### Retry Button — `[ RETRY ]`
- Restarts test with same difficulty
- Dismisses overlay, resets all state, generates new word list, transitions to fresh Test screen
- Does NOT go back to Home first

#### Home Button — `[ HOME ]`
- Discards result, transitions to Home screen
- Difficulty selection resets (not remembered)

**Button states:** Same as Home screen Start button (see Screen 1).

---

### Animations — Result Overlay

| Element | Animation | Trigger |
|---|---|---|
| Backdrop | Fade in (opacity 0 → 0.85, 200ms) | On mount |
| Modal container | Scale 0.85 → 1.0 + fade in, spring (stiffness 300, damping 25) | On mount |
| `TEST COMPLETE` | Characters reveal left to right, 30ms per character | After modal enters |
| WPM count-up | 0 → final, 800ms easeOut | After header reveal |
| Accuracy count-up | 0 → final, 600ms easeOut, 100ms delay after WPM starts | After header reveal |
| Character breakdown | Fade in (150ms) | After accuracy count-up ends |
| Buttons | Fade in + slide up (150ms) | After character breakdown |
| Retry/Home button hover | Same as Home screen button hover | On hover |
| Overlay exit | Scale 1.0 → 0.95 + fade out (150ms) | On button press |

---

### Edge Cases — Result Overlay

| Scenario | Behavior |
|---|---|
| User presses Escape on result screen | Ignored. Must use buttons. |
| User presses Enter on result screen | Triggers `[ RETRY ]` (default action) |
| WPM is 0 (user typed nothing or all wrong) | Shows `0` with no special treatment |
| Accuracy is 100% | No special treatment. No confetti. Consistent with retro aesthetic. |
| Accuracy is 0% | Shows `0%`. No special treatment. |
| User clicks backdrop (outside modal) | Ignored. Must use buttons. |

---

## State Shape (for Claude Code reference)

```ts
type Screen = 'home' | 'test' | 'result'

type Difficulty = 'easy' | 'medium' | 'hard'

interface AppState {
  screen: Screen
  difficulty: Difficulty | null
}

interface TestState {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
  started: boolean         // true after first keypress
  finished: boolean        // true after timer hits 0 or word list exhausted
  timeLeft: number         // 60 down to 0
  correctChars: number
  incorrectChars: number
  totalTypedChars: number
  activeKey: string | null
  capsLockOn: boolean
  quitting: boolean        // true when Escape confirmation is showing
}

interface ResultState {
  wpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
}

interface Word {
  chars: Char[]
  state: 'untyped' | 'active' | 'correct' | 'incorrect'
}

interface Char {
  expected: string
  typed: string | null
  state: 'untyped' | 'correct' | 'incorrect'
}
```

---

## What Is Explicitly Out of Scope

- On-screen keyboard
- Sound toggle UI (sound always on)
- Pause mechanic (Escape = quit, not pause)
- Score history or localStorage
- Custom text input
- Mobile/touch support
- Themes or color switching
- Any server-side logic
