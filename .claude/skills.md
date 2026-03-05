# Project Skills — Retro Typing Test
# Place at: .claude/skills.md

## Typing Engine

useTypingEngine is the most important hook. When building or modifying it:

Characters are compared one at a time via event.key against expected char.
Each correct or incorrect keypress advances currentCharIndex only — not the word.
Space always advances currentWordIndex and resets currentCharIndex to 0. It locks the current word state.
Backspace removes the last typed character in the current word. It cannot go below index 0.
The timer (started flag) is only set to true on the first printable character. Space and Backspace before that are ignored.
WPM = (correctChars / 5) / (elapsedSeconds / 60). Recalculate every second using setInterval.
Accuracy = Math.round((correctChars / totalTypedChars) * 100). Use 0 if totalTypedChars is 0.
isComplete becomes true either when all words are typed or when useCountdown calls onComplete.
After isComplete, all keypresses are ignored.

---

## Web Audio API

When building useKeystrokeSound, follow this pattern exactly:

Store AudioContext in a useRef initialized to null.
On first keydown event: if audioContextRef.current is null, create new AudioContext() and assign it.
Before every sound: if audioContextRef.current.state is 'suspended', call audioContextRef.current.resume() and await it.

To play a sound:
  const ctx = audioContextRef.current
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.type = 'square'  (or 'sawtooth' for wrong)
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
  gainNode.gain.setValueAtTime(AUDIO_GAIN, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
  oscillator.onended = () => { oscillator.disconnect(); gainNode.disconnect() }

Never reuse oscillators — create a new one for each sound.

---

## Framer Motion

All animation variants are const at the top of the file before the component function.
Never define variants inline in JSX — it causes unnecessary re-renders.

Standard screen transition pattern:
  const screenVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.1 } }
  }
  Wrap each screen with motion.div and apply variants.
  Wrap the screen switcher in AnimatePresence with mode="wait".

For the wrong key shake, apply to the word span, not individual characters.
For result count-up, use the animate function from framer-motion with a motionValue.

---

## CSS Modules + Tailwind Split

Use Tailwind for layout, spacing, flex, grid.
Use CSS Modules for: amber glows, CRT effects, custom keyframe animations, anything requiring CSS custom properties that Tailwind cannot reference cleanly.

In CSS Modules you can reference custom properties: color: var(--color-amber).
Tailwind cannot do this for arbitrary values cleanly, so use CSS Modules.

---

## StatsBar Layout Stability

This is the most common bug: StatsBar causes layout shift when it appears.

Wrong: display: none then display: block — causes reflow.
Wrong: conditional rendering with && — removes from DOM, causes reflow.
Correct: always render StatsBar, use opacity: 0 and pointer-events: none when hidden.
  When started becomes true, animate opacity from 0 to 1.
  The height is always reserved because the element is always in the DOM.
