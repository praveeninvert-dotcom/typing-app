# Global Standards — Retro Typing Test
# Place at: standards/GLOBAL-STANDARDS.md

## Tech Stack

Framework: Next.js 14 App Router
Language: TypeScript strict mode — zero any, zero @ts-ignore
Styling: Tailwind CSS v3 + CSS Modules per component
Animations: Framer Motion — variants as named constants, never inline in JSX
Audio: Web Audio API — no external audio files ever
Testing: Vitest + React Testing Library + Playwright
Fonts: next/font/google — Press Start 2P and VT323
Package manager: npm

No backend. No database. No auth. No localStorage. No sessionStorage.

---

## Code Quality Non-Negotiables

TypeScript strict mode. Zero any. If the type is unknown, figure it out.
No console.log in committed code. console.error is acceptable for genuine errors.
Every function does one thing.
No magic numbers. All constants live in lib/constants.ts with names.
Animation variants: always const variants = {} at top of file, never inline.
AudioContext created on first user interaction only, never on mount.
StatsBar hides with opacity: 0, never display: none. Height must always be reserved.
Memoize character state in TextDisplay — do not re-render entire list on every keypress.

---

## When to Read Each Standards File

Building any screen or component: DESIGN-SYSTEM.md + ACCESSIBILITY-STANDARDS.md
Structuring folders and files: ARCHITECTURE-STANDARDS.md
Writing tests: TESTING-STANDARDS.md
Any security or data handling question: SECURITY-STANDARDS.md
Marking a phase complete: docs/PHASE-CHECKLIST.md

---

## Decision Rules

Boring over clever — use the obvious pattern.
Explicit over implicit — name things clearly.
Typed over untyped — every data shape has a TypeScript type.
Accessible first — keyboard nav and ARIA built in from the start.

---

## Commit Format

type(scope): description

Types: feat, fix, style, refactor, test, chore
Scopes: home, test-screen, result, hooks, lib, types, config, a11y

Examples:
feat(hooks): implement useTypingEngine with WPM calculation
fix(test-screen): ignore space key before first character typed
style(home): stagger difficulty button entrance animation
test(hooks): add useCountdown edge case for zero seconds

---

## Performance Budget

No phase is complete until all of these pass:
No layout shift on any screen transition.
No layout shift when StatsBar animates in on first keypress.
Animations run at 60fps — no Framer Motion layout thrashing.
No unnecessary re-renders on every keypress — memoize character state.
Lighthouse Performance score 90 or above.

---

## What Claude Must Never Do Without Asking

Add localStorage, sessionStorage, or cookies.
Add any backend, database, or third-party service.
Add routing of any kind — no useRouter, no Link, no next/navigation.
Change the TypeScript state types defined in .planning/SCREENS.md.
Add audio files to /public — all sound is Web Audio API.
Add features not listed in .planning/REQUIREMENTS.md.
