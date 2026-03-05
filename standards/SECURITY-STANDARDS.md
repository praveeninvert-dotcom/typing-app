# Security Standards — Retro Typing Test
# Place at: standards/SECURITY-STANDARDS.md

## Scope

Pure frontend. No server. No user data transmitted anywhere.
Security surface is minimal: XSS prevention, safe DOM handling, Web Audio API safety.

---

## XSS Prevention

Never use dangerouslySetInnerHTML. Not once, not anywhere.
All word list content is hardcoded strings. No user-generated content is ever rendered as HTML.
Character spans are rendered by mapping over arrays — always as React text content, never HTML.
User input (keystrokes) is compared against expected strings only. Never injected into the DOM.

---

## Web Audio API Safety

AudioContext must be created inside a user gesture handler — a click or keydown event.
Never create AudioContext on component mount or in a useEffect without a user trigger.
Always check AudioContext state before playing. Call resume() if state is 'suspended'.
Gain values must stay at or below AUDIO_GAIN (0.1) to avoid jarring audio.
Always call oscillator.stop() after the sound duration.
Always call oscillator.disconnect() and gainNode.disconnect() after stopping.
Failure to disconnect causes memory leaks over long sessions.

Correct pattern for useKeystrokeSound:
  const audioContextRef = useRef(null)
  On first keydown: if no audioContextRef.current, create new AudioContext()
  Before each sound: if state is 'suspended', call await audioContext.resume()
  Create OscillatorNode, connect to GainNode, connect to destination
  Set frequency, type, gain value
  Schedule gain ramp: exponentialRampToValueAtTime(0.001, currentTime + duration)
  Call start(), call stop(currentTime + duration)
  In onstop handler: oscillator.disconnect(), gainNode.disconnect()

---

## Type Safety as Security

TypeScript strict mode prevents unexpected type coercions.
Difficulty type is a union — only 'easy', 'medium', 'hard' are valid values.
Screen type is a union — only 'home', 'test', 'result' are valid values.
CharState and WordState are unions — invalid states cannot exist at runtime.

---

## No Data Exfiltration

No fetch calls. No XMLHttpRequest. No WebSocket. Nothing leaves the browser.
No analytics. No error tracking service. No telemetry.
No environment variables.
No cookies.
No localStorage. No sessionStorage.

---

## Dependency Security

Run npm audit before each phase sign-off.
Zero high or critical vulnerabilities allowed.
Keep next and framer-motion on latest minor/patch versions.
No new dependencies without an explicit reason documented in a commit message.

---

## What This Project Does Not Need

No CSRF protection — no forms that submit to a server.
No rate limiting — no API.
No authentication — no users.
No input sanitization beyond TypeScript type checking — no HTML injection surface.
No Content Security Policy headers — Next.js defaults are sufficient for a no-API frontend.
