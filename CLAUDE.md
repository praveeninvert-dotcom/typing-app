# Retro Typing Test — Claude Context
# Rename this file to CLAUDE.md in your project root.
# Claude Code auto-loads this every session.

## Project Identity

Name: Retro Typing Test
Type: Pure frontend web app — no backend, no auth, no persistence
Status: Active development
What it does: 60-second typing speed test. Retro terminal aesthetic. Keystroke sounds via Web Audio API. Three difficulty levels.

---

## Standards (Read Before Writing Any Code)

- standards/GLOBAL-STANDARDS.md
- standards/DESIGN-SYSTEM.md
- standards/ARCHITECTURE-STANDARDS.md
- standards/TESTING-STANDARDS.md
- standards/ACCESSIBILITY-STANDARDS.md
- standards/SECURITY-STANDARDS.md

---

## Tech Stack

Framework: Next.js 14 App Router
Language: TypeScript strict mode
Styling: Tailwind CSS + CSS Modules per component
Animations: Framer Motion
Audio: Web Audio API only — no external sound files
Fonts: Press Start 2P and VT323 via next/font/google
Package manager: npm

NO backend. NO Prisma. NO Supabase. NO NextAuth. NO database. NO localStorage.

---

## Color Palette (CSS custom properties in globals.css)

--color-bg: #0a0a0a
--color-surface: #111111
--color-amber: #ffb000          primary
--color-amber-dim: #7a5500
--color-blue: #00aaff           secondary
--color-blue-dim: #004466
--color-green-correct: #39ff14
--color-red-wrong: #ff3333
--color-text-dim: #444444

---

## Architecture Rules

Single page. No useRouter. No Link. Screen state is 'home' | 'test' | 'result'.
TypingApp.tsx is the root state machine. All transitions live here.
Hidden input captures all keystrokes on test screen.
Animation variants defined as const variants at top of each file, never inline in JSX.
AudioContext created on first user interaction, never on component mount.
StatsBar uses opacity: 0 to hide — never display: none. Height must always be reserved.

---

## Screen Specs

Full specs with elements, states, animations, edge cases, and TypeScript types:
.planning/SCREENS.md

Use the state shape defined there exactly. Do not invent different type names.

---

## Build Order (follow exactly)

1. types/index.ts
2. lib/constants.ts
3. lib/wordLists.ts
4. lib/generateText.ts
5. hooks/useKeystrokeSound.ts
6. hooks/useCountdown.ts
7. hooks/useTypingEngine.ts
8. components/DifficultySelector/
9. components/StatsBar/
10. components/TextDisplay/
11. components/ResultOverlay/
12. components/HomeScreen/
13. components/TestScreen/
14. components/TypingApp.tsx
15. app/globals.css
16. app/layout.tsx
17. app/page.tsx

---

## Never Do Without Asking

- Add localStorage or sessionStorage
- Add any backend dependency (Prisma, Supabase, NextAuth)
- Add routing of any kind (useRouter, Link, next/navigation)
- Add audio files to /public
- Change the TypeScript state types from .planning/SCREENS.md
- Add features not listed in .planning/REQUIREMENTS.md

---

## Context

This project benchmarks Claude Code with a fully pre-specified codebase. Every screen, element, animation, and edge case is already defined. Execute the spec exactly. If something is ambiguous, ask — do not assume.
