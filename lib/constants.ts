// NEXT_PUBLIC_TEST_TIMER_DURATION lets E2E tests shorten the timer (e.g. 3s)
// without changing production behavior. Set in playwright.config.ts webServer command.
export const TIMER_DURATION =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_TEST_TIMER_DURATION
    ? parseInt(process.env.NEXT_PUBLIC_TEST_TIMER_DURATION, 10)
    : 60              // seconds

export const WORDS_PER_TEST = 80             // words generated per test session

// Audio frequencies (used in Phase 3 useKeystrokeSound)
export const CORRECT_FREQ = 800              // Hz, square wave, 60ms
export const INCORRECT_FREQ = 200            // Hz, sawtooth wave, 100ms
export const CORRECT_DURATION = 0.06         // seconds
export const INCORRECT_DURATION = 0.1        // seconds
