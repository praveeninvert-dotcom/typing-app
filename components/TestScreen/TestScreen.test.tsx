import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TestScreen } from './index'

// Mock hooks and child components to isolate TestScreen
vi.mock('@/lib/generateText', () => ({
  generateText: () => [
    {
      chars: [
        { expected: 't', state: 'pending' },
        { expected: 'h', state: 'pending' },
        { expected: 'e', state: 'pending' },
      ],
      state: 'pending',
    },
  ],
}))

vi.mock('@/hooks/useTypingEngine', () => ({
  useTypingEngine: () => ({
    words: [{ chars: [{ expected: 't', state: 'pending' }], state: 'pending' }],
    currentWordIndex: 0,
    currentCharIndex: 0,
    started: false,
    finished: false,
    correctChars: 0,
    incorrectChars: 0,
    totalTypedChars: 0,
    handleKey: vi.fn(),
  }),
}))

vi.mock('@/hooks/useCountdown', () => ({
  useCountdown: () => ({
    timeLeft: 60,
    start: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  }),
}))

vi.mock('@/hooks/useKeystrokeSound', () => ({
  useKeystrokeSound: () => ({
    playCorrect: vi.fn(),
    playIncorrect: vi.fn(),
  }),
}))

vi.mock('@/components/StatsBar', () => ({
  StatsBar: (props: object) => <div data-testid="stats-bar" />,
}))

vi.mock('@/components/TextDisplay', () => ({
  TextDisplay: (props: object) => <div data-testid="text-display-inner" />,
}))

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

const defaultProps = {
  difficulty: 'easy' as const,
  onFinish: vi.fn(),
  onQuit: vi.fn(),
}

describe('TestScreen', () => {
  it('renders a div with data-testid="test-container"', () => {
    render(<TestScreen {...defaultProps} />)
    expect(screen.getByTestId('test-container')).toBeInTheDocument()
  })

  it('container renders StatsBar as first child', () => {
    render(<TestScreen {...defaultProps} />)
    const container = screen.getByTestId('test-container')
    expect(container.firstElementChild).toBe(screen.getByTestId('stats-bar'))
  })

  it('renders text display area with data-testid="text-display"', () => {
    render(<TestScreen {...defaultProps} />)
    expect(screen.getByTestId('text-display')).toBeInTheDocument()
  })

  it('no sound toggle button renders', () => {
    render(<TestScreen {...defaultProps} />)
    expect(screen.queryByText(/SND/i)).toBeNull()
    expect(screen.queryByText(/SOUND/i)).toBeNull()
    expect(screen.queryByText(/SFX/i)).toBeNull()
  })

  it('no button with sound-related aria-label renders', () => {
    render(<TestScreen {...defaultProps} />)
    const buttons = screen.queryAllByRole('button')
    const soundButton = buttons.find(b =>
      b.getAttribute('aria-label')?.toLowerCase().includes('sound') ||
      b.getAttribute('aria-label')?.toLowerCase().includes('mute')
    )
    expect(soundButton).toBeUndefined()
  })

  it('renders escape hint text', () => {
    render(<TestScreen {...defaultProps} />)
    expect(screen.getByText('[ ESC ] QUIT')).toBeInTheDocument()
  })
})
