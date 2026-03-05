# Design System — Retro Typing Test
# Place at: standards/DESIGN-SYSTEM.md

## Aesthetic

CRT terminal from 1982. Amber primary. Blue secondary. Black background.
No gradients except the CRT vignette. No box shadows except amber/blue glows.
No rounded corners except 2px on buttons. No decorative elements.
Every visual element serves the experience.

---

## Fonts

Press Start 2P — all UI labels, buttons, headings, metadata, hints
VT323 — typing text display, large stat numbers, result values

Press Start 2P sizes:
  8px   labels, hints, escape hint, metadata
  9px   secondary labels, stat labels
  12px  difficulty descriptors, subtitles
  14px  buttons, primary UI text
  clamp(24px, 4vw, 40px)  main title TYPING.EXE

VT323 sizes:
  24px  character breakdown in results
  28px  test text display (line-height: 2.0)
  48px  live stats — WPM, TIME, ACC values
  72px  accuracy value in result overlay
  96px  WPM value in result overlay

---

## CSS Custom Properties
Define in app/globals.css

--color-bg: #0a0a0a
--color-surface: #111111
--color-amber: #ffb000
--color-amber-dim: #7a5500
--color-blue: #00aaff
--color-blue-dim: #004466
--color-green-correct: #39ff14
--color-red-wrong: #ff3333
--color-text-dim: #444444
--color-white: #f0f0f0

---

## CRT Effect
Apply in app/globals.css

Scanlines on body::after:
  content: ''
  position: fixed
  inset: 0
  pointer-events: none
  z-index: 9999
  background: repeating-linear-gradient(
    0deg,
    transparent, transparent 2px,
    rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
  )

Vignette on body::before:
  content: ''
  position: fixed
  inset: 0
  pointer-events: none
  z-index: 9998
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)

---

## Button Pattern

Default:    1px solid var(--color-amber-dim), color var(--color-amber-dim), bg transparent, border-radius 2px
Hover:      1px solid var(--color-amber), color var(--color-amber), bg rgba(255,176,0,0.05)
Selected:   2px solid var(--color-amber), color var(--color-amber), bg rgba(0,170,255,0.1)
Disabled:   opacity 0.3, cursor not-allowed, no hover effect
Press:      scale 0.95, brief amber background flash 80ms via Framer Motion whileTap

---

## Glow Effects

Amber glow:   text-shadow: 0 0 8px rgba(255,176,0,0.8)
Blue glow:    text-shadow: 0 0 8px rgba(0,170,255,0.8)
Green flash:  text-shadow: 0 0 12px rgba(57,255,20,0.9)
Red error:    text-shadow: 0 0 6px rgba(255,51,51,0.8)

---

## Blinking Cursor

Block cursor on title: CSS animation, 600ms interval, opacity toggle.
Character cursor in TextDisplay: border-left on current char span, 500ms interval.
Both pause when user is actively typing — toggle a class via JS.
Cursor blink pause debounce: 300ms after last keypress.

---

## Framer Motion Patterns

Screen transition (wrap screens in AnimatePresence):
  Exit:   opacity 0, scale 0.98, duration 0.1s ease-out
  Enter:  opacity 0 to 1, y 12 to 0, duration 0.2s ease-out

Home screen stagger entry:
  Container: staggerChildren 0.06, delayChildren 0.1
  Children:  opacity 0 to 1, y 8 to 0

Difficulty button select:
  Scale pulse: 1 to 1.03 to 1, 150ms
  Amber underline: scaleX 0 to 1, origin left, 150ms

Start button press:
  whileTap: scale 0.95
  onClick: brief amber background flash 80ms, then screen transition

Wrong key shake:
  x keyframes: [0, -4, 4, -4, 0], duration 0.2s, apply to current word span

Correct word flash:
  Brief green opacity overlay: 0 to 0.4 to 0, 150ms

Result overlay spring:
  initial: scale 0.85, opacity 0
  animate: scale 1, opacity 1
  transition: spring, stiffness 300, damping 25

Result backdrop:
  initial: opacity 0
  animate: opacity 0.85
  duration: 0.2s

Count-up animation for result stats:
  Implement with useMotionValue + animate from framer-motion
  WPM: 0 to final over 800ms easeOut
  Accuracy: 0 to final over 600ms easeOut, 100ms delay

---

## TextDisplay Rules

Font: VT323 28px, line-height 2.0
Current word: 2px solid var(--color-amber) underline
Completed incorrect word: bg rgba(255,51,51,0.1) persists for entire test
Smooth scroll when active line changes — scrollIntoView with behavior: smooth
Never show a scrollbar — overflow: hidden on container, scroll programmatically

---

## StatsBar Rules

Always reserves its height. Use opacity: 0 + pointer-events: none when hidden.
Never use display: none or visibility: hidden — causes layout shift.
On first keypress: animate opacity 0 to 1 + slide down from -8px, 200ms.
TIME value turns var(--color-red-wrong) when timeLeft <= WARNING_TIMER_THRESHOLD.
TIME pulses at scale 1 to 1.08 to 1 every 1s when in warning state.

---

## ResultOverlay Rules

Position: fixed, inset 0, z-index 100
Backdrop: rgba(0,0,0,0.85)
Modal: centered, max-width 480px, bg var(--color-surface), border 1px solid var(--color-amber-dim), border-radius 4px, padding 48px
TEST COMPLETE header: character-by-character reveal on mount, 30ms per character
Character breakdown fades in after accuracy count-up finishes
Retry button gets focus on mount
