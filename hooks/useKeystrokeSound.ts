// Phase 1 stub — Phase 3 will implement actual Web Audio API sounds
// Interface defined here so TestScreen imports work without changes in Phase 3

interface UseKeystrokeSoundReturn {
  playCorrect: () => void
  playIncorrect: () => void
}

export function useKeystrokeSound(): UseKeystrokeSoundReturn {
  // No-op functions — Phase 3 replaces with Web Audio API (square 800Hz / sawtooth 200Hz)
  // Do NOT create AudioContext here — CLAUDE.md requires first user interaction
  const playCorrect = () => {}
  const playIncorrect = () => {}

  return { playCorrect, playIncorrect }
}
