# Quick Reference — Retro Typing Test + GSD

## Phases

Phase 1: Foundation + Core Typing Engine
Phase 2: Live Stats + Result Polish
Phase 3: Sounds + Edge Cases + Animations + A11y

---

## GSD Command Loop (every phase)

/gsd:discuss-phase N     Lock decisions before Claude plans anything
/gsd:plan-phase N        Research and create atomic task plans
/gsd:execute-phase N     Build in parallel waves
/gsd:verify-work N       Test against exit criteria, run PHASE-CHECKLIST.md manually
/clear                   Always clear before next phase

---

## Other Commands

/gsd:quick               Bug fixes and small tweaks
/gsd:progress            See current state if lost
/gsd:resume-work         Restore context after a break
/gsd:debug "problem"     Systematic diagnosis when something breaks

---

## Key Files

CLAUDE.md                     Claude reads this every session
.planning/SCREENS.md          Full element specs, types, edge cases
.planning/REQUIREMENTS.md     What is in scope
.planning/ROADMAP.md          Phase breakdown and exit criteria
docs/PHASE-CHECKLIST.md       Run before marking any phase done
standards/                    All technical standards

---

## TypeScript Types

type Screen = 'home' | 'test' | 'result'
type Difficulty = 'easy' | 'medium' | 'hard'
type CharState = 'untyped' | 'correct' | 'incorrect'
type WordState = 'untyped' | 'active' | 'correct' | 'incorrect'

interface Char { expected: string; typed: string | null; state: CharState }
interface Word { chars: Char[]; state: WordState }

interface TestState {
  words: Word[]
  currentWordIndex: number
  currentCharIndex: number
  started: boolean
  finished: boolean
  timeLeft: number
  correctChars: number
  incorrectChars: number
  totalTypedChars: number
  capsLockOn: boolean
  quitting: boolean
}

interface ResultState {
  wpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
}

---

## Constants (lib/constants.ts)

TIMER_DURATION = 60
WORDS_PER_TEST = 80
CORRECT_FREQ = 800
WRONG_FREQ = 200
CORRECT_DURATION = 0.06
WRONG_DURATION = 0.1
AUDIO_GAIN = 0.1
CURSOR_BLINK_MS = 500
CURSOR_BLINK_PAUSE_MS = 300
WARNING_TIMER_THRESHOLD = 10

---

## Formulas

WPM: (correctChars / 5) / (elapsedSeconds / 60) — recalculate every second
Accuracy: Math.round((correctChars / totalTypedChars) * 100) — show '--' before first char

---

## Common Mistakes

Not clearing between phases: always /clear after verify.
Skipping discuss: Claude assumes. Assumptions get built in.
display:none on StatsBar: layout shift. Use opacity:0.
AudioContext on mount: browser blocks it. Create on first keydown.
Animation variants inline in JSX: define as const at top of file.
Using useRouter or Link: this app has no routing.
