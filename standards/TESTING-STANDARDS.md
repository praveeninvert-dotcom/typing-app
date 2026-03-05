# Testing Standards — Retro Typing Test
# Place at: standards/TESTING-STANDARDS.md

## Philosophy

Test business logic and user interactions. Skip trivial renders.
useTypingEngine is the core of the product — test it thoroughly.
E2E covers critical user paths only.

---

## Stack

Unit and component tests: Vitest + React Testing Library + @testing-library/user-event
E2E: Playwright
A11y: @axe-core/playwright

Install commands:
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npm install -D @playwright/test @axe-core/playwright

vitest.config.ts settings:
  plugins: [react()]
  test.environment: jsdom
  test.setupFiles: ['./src/test/setup.ts']
  test.globals: true

---

## What to Test

### useTypingEngine

WPM is 0 before first keypress.
Correct character advances currentCharIndex.
Incorrect character marks char incorrect, does not advance.
Space advances currentWordIndex regardless of word correctness.
Space before first character does not start the engine.
Backspace removes last char of current word only.
Backspace at word start does nothing — no crossing boundary.
isComplete is true when word list exhausted.
Input is ignored after isComplete.
WPM formula: (correctChars / 5) / (elapsedSeconds / 60).
Accuracy: Math.round((correctChars / totalTypedChars) * 100).
Accuracy is 0 when totalTypedChars is 0.

### useCountdown

Starts only when start() is called.
Ticks every second.
Calls onComplete when timeLeft hits 0.
reset() restores to initial value.
Does not tick below 0.

### generateText

Returns exactly WORDS_PER_TEST words.
All words come from the correct difficulty pool.
Different calls produce different sequences.

### HomeScreen

Renders EASY, MEDIUM, HARD options.
Start disabled before difficulty selected.
Clicking difficulty selects it, enables Start.
Enter on enabled Start fires onStart.
Arrow keys navigate difficulty options.

### TestScreen

Hidden input focused on mount.
Clicking screen re-focuses hidden input.
Caps Lock warning appears when CapsLock on.
Caps Lock warning disappears when CapsLock off.
Escape shows quit confirmation.
YES in confirmation calls onQuit.
NO dismisses confirmation and resumes.
Escape while confirmation showing dismisses it.

### ResultOverlay

Displays WPM, accuracy, correct count, incorrect count from props.
Retry button calls onRetry.
Home button calls onHome.
Enter key triggers onRetry.

---

## E2E Tests (Playwright)

Path 1: Full test run
  Load. Select difficulty. Start. Type words. Timer expires. Result overlay appears. WPM > 0. Retry works.

Path 2: Quit flow
  Start test. Type. Escape. Quit confirmation appears. NO resumes. Escape again. YES returns home with no difficulty selected.

Path 3: A11y scan
  axe-core on home screen — zero violations.
  axe-core on test screen — zero violations.
  axe-core on result overlay — zero violations.

---

## Test File Locations

hooks/useTypingEngine.test.ts
hooks/useCountdown.test.ts
lib/generateText.test.ts
components/HomeScreen/HomeScreen.test.tsx
components/TestScreen/TestScreen.test.tsx
components/ResultOverlay/ResultOverlay.test.tsx
playwright/tests/full-run.spec.ts
playwright/tests/quit-flow.spec.ts
playwright/tests/accessibility.spec.ts

---

## Phase Gate

npm run test: zero failures.
npm run test:e2e: all three paths pass.
No .skip without a documented reason.
axe-core passes on all three screens.
