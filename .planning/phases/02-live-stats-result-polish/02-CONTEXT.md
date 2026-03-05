# Phase 2: Live Stats + Result Polish - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Animate stats live during typing and display a polished result overlay after the test ends. Covers WPM/accuracy display behavior, StatsBar animation, 10-second timer warning, ResultOverlay count-up animations, character breakdown, and Retry/Home transitions. No new test mechanics — scope is display and animation only.

</domain>

<decisions>
## Implementation Decisions

### WPM display behavior
- Show `0` for the first 5 seconds of the test, regardless of characters typed
- After 5 seconds elapsed, switch to live WPM using the formula: `(correctChars / 5) / (elapsedSeconds / 60)`
- This prevents absurd early spikes (e.g., 3 chars in 0.5s = 720 WPM) while keeping the transition simple and predictable

### Count-up animation style
- Stepped/chunky counting — like an old odometer flipping, not smooth frame interpolation
- ~8–12 visible steps over the animation duration (800ms for WPM, 600ms for accuracy)
- Pacing: fast start, slow finish — counts quickly at first, decelerates as it approaches the final number
- Must land exactly on the final value

### Retry + Home transitions
- Both RETRY and HOME buttons use the same 200ms fade treatment: result overlay fades out in 200ms, then target screen fades in in 200ms
- No distinction between the two — consistent behavior for both actions
- Retry generates a new word list for the same difficulty; Home resets difficulty selection

### Claude's Discretion
- Character breakdown counting: how to handle partially typed last word when timer hits 0 (count all characters typed, including partial word, vs. completed words only)
- Exact easing curve implementation for the stepped count-up deceleration
- StatsBar slide animation specifics (spec defines fade in + slide down from -8px, 200ms — implementation details at Claude's discretion)
- 10-second pulse stop behavior (when does pulse animation stop — at 0 or earlier)

</decisions>

<specifics>
## Specific Ideas

- The stepped count-up should evoke a retro odometer or slot machine — mechanical, not fluid
- "Fast start, slow finish" pacing for count-up: the deceleration toward the final number is the satisfying moment

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-live-stats-result-polish*
*Context gathered: 2026-03-05*
