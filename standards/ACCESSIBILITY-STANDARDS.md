# Accessibility Standards — Retro Typing Test
# Place at: standards/ACCESSIBILITY-STANDARDS.md

## Non-Negotiables

Every interactive element is keyboard reachable.
Focus ring always visible — never outline: none without a styled replacement.
Color is never the only signal. Correct/wrong chars use color AND cursor position.
All buttons have descriptive labels.
Dynamic content changes announced to screen readers.
Single logical h1 per screen.

---

## Keyboard Navigation

Home screen:
  Tab cycles through difficulty buttons and Start.
  Arrow up/down navigate difficulty options.
  Enter or Space selects focused difficulty.
  Enter on Start triggers onStart.

Test screen:
  All keyboard input goes to hidden input. This IS the keyboard interaction.
  Escape opens quit confirmation.
  In quit confirmation: Tab between YES and NO, Enter activates focused, Escape dismisses.

Result overlay:
  Focus moves to Retry on mount.
  Tab between Retry and Home.
  Enter triggers Retry.
  Escape does nothing — must use buttons.

---

## ARIA Requirements

DifficultySelector:
  Container: role="radiogroup", aria-label="Select difficulty"
  Each option: role="radio", aria-checked="true" or "false"
  aria-label includes descriptor: "Easy, 200 common words"

StatsBar:
  WPM: aria-live="polite", aria-label="Words per minute: [value]"
  TIME: aria-live="off" during test — too frequent
  ACC: aria-label="Accuracy: [value] percent"

Caps Lock warning:
  role="alert", aria-live="assertive" — announces immediately on appearance

Quit confirmation:
  role="dialog", aria-modal="true"
  aria-labelledby pointing to QUIT TEST heading id
  Focus trapped inside while open
  Focus returns to hidden input on dismiss

Result overlay:
  role="dialog", aria-modal="true"
  aria-labelledby pointing to TEST COMPLETE heading id
  Focus moves to Retry on mount
  Focus trapped inside

Hidden input:
  aria-label="Type the displayed text"

Start button when disabled:
  aria-disabled="true" paired with the HTML disabled attribute

---

## Contrast Notes

Amber #ffb000 on #0a0a0a: 9.2:1 — passes AA and AAA.
Blue #00aaff on #0a0a0a: 6.8:1 — passes AA.
Green #39ff14 on #0a0a0a: passes AA.
Red #ff3333 on #0a0a0a: passes AA.
Dim #444444 on #0a0a0a: 1.8:1 — FAILS AA.

Dim color failure is intentional and acceptable ONLY because untyped characters
are not interactive and state is communicated through cursor position, not color alone.
Add a code comment wherever --color-text-dim is used documenting this exception.

---

## Screen Reader Announcements

Test complete: Use a visually hidden aria-live="polite" element.
  On result mount set its text: "Test complete. WPM is [N]. Accuracy [N] percent."
  This fires once.

Caps Lock: role="alert" fires immediately when element appears.

During test: announce nothing per keypress. Too overwhelming.

---

## Focus Management

TestScreen mount: auto-focus hidden input.
Click on TestScreen: re-focus hidden input silently.
Quit confirmation open: trap focus in YES/NO.
Quit confirmation close: return focus to hidden input.
Result overlay mount: focus Retry button.
After Retry: focus new TestScreen hidden input.
After Home: focus first difficulty option on HomeScreen.

---

## Phase Sign-Off Checklist

axe-core scan passes on all three screens.
Tab navigation manually tested on all screens.
All interactive elements have visible focus states.
Quit confirmation focus trap verified.
Result overlay focus trap verified, Retry gets focus on mount.
Caps Lock warning fires as role="alert".
Test complete announcement verified via screen reader.
DifficultySelector has radiogroup and radio roles.
