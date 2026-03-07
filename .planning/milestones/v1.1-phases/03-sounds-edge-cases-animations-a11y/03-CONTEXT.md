# Phase 3: Sounds + Edge Cases + Animations + A11y - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Full production quality for the retro typing test. Adds Web Audio API keystroke sounds, Caps Lock warning, Escape quit confirmation with timer freeze and focus trap, all Framer Motion animations (home stagger, difficulty select pulse, wrong key shake, correct word flash, TextDisplay smooth scroll, result spring), cursor blink pause on active typing, aria-live announcement on test complete, and focus traps in both overlays. No new features — this completes what Phases 1-2 deferred.

</domain>

<decisions>
## Implementation Decisions

### Sound controls
- Sounds are ON by default — play immediately on first keypress (after AudioContext created on first user interaction)
- A mute toggle is present on the test screen, always visible
- Location: corner of the test screen (top-right or similar unobtrusive corner)
- Style: retro text `[ SND: ON ]` / `[ SND: OFF ]` using Press Start 2P font, amber color — matches the terminal aesthetic
- Clicking the toggle switches sound state instantly

### Reduced motion
- `prefers-reduced-motion: reduce` is respected — reduce animations, don't fully remove them
- Fades and opacity transitions are kept (non-moving)
- Shakes, slides, and scale pulses are removed
- **Wrong key feedback in reduced motion:** shake removed — wrong characters just turn red (color is sufficient feedback)
- **Result overlay in reduced motion:** fade in only (opacity 0 → 1), no scale spring entrance
- **TIME ≤ 10 warning in reduced motion:** color change only — value turns red, no scale pulse
- **Screen transitions in reduced motion:** fade only, no slide

### Claude's Discretion
- Exact corner position of the SND toggle (top-right preferred but adjust for layout)
- How to detect prefers-reduced-motion (CSS media query + JS matchMedia hook)
- Animation variant structure for reduced vs full motion (shared variant objects with conditional values)
- Focus order within the quit confirmation (YES first, then NO is a reasonable default)
- aria-live region verbosity during test (only "TEST COMPLETE" on completion, not during typing)

</decisions>

<specifics>
## Specific Ideas

- The `[ SND: ON ]` / `[ SND: OFF ]` toggle should feel like a retro terminal command — same visual language as the difficulty buttons and stat labels
- Reduced motion behavior is "quiet" — still functional, just no movement. The retro color palette and fonts do the heavy lifting.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-sounds-edge-cases-animations-a11y*
*Context gathered: 2026-03-06*
