# Retro Typing Test

A browser-based typing speed test with a retro terminal aesthetic. Pure frontend — no backend, no auth, no persistence.

## What It Is

60-second typing test with three difficulty levels, live WPM/accuracy stats, keystroke sounds via Web Audio API, and a CRT-style retro UI. Built to test and benchmark Claude Code performance with a fully pre-specified project.

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS Modules |
| Animations | Framer Motion |
| Audio | Web Audio API (no external files) |
| Fonts | Press Start 2P + VT323 (Google Fonts) |
| Package manager | npm |

## Project Structure

```
typing-test/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── TypingApp.tsx
│   ├── HomeScreen/
│   ├── TestScreen/
│   ├── TextDisplay/
│   ├── StatsBar/
│   ├── ResultOverlay/
│   └── DifficultySelector/
├── hooks/
│   ├── useTypingEngine.ts
│   ├── useCountdown.ts
│   └── useKeystrokeSound.ts
├── lib/
│   ├── wordLists.ts
│   ├── generateText.ts
│   └── constants.ts
└── types/
    └── index.ts
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Key Decisions

- No localStorage — results are not persisted between sessions
- No routing — screen state managed via React state only
- No external sound files — audio generated via Web Audio API
- Timer starts on first keypress, not on screen load
- StatsBar uses opacity: 0 to hide, never display: none

## Planning Files

All GSD planning files: `.planning/`
Standards: `standards/`
Phase checklists: `docs/PHASE-CHECKLIST.md`
Full screen specs: `.planning/SCREENS.md`
