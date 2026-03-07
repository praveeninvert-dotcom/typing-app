import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ResultOverlay } from './index'
import type { ResultState } from '@/types'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

const mockResult: ResultState = {
  wpm: 80,
  accuracy: 95,
  correctChars: 400,
  incorrectChars: 20,
}

describe('ResultOverlay', () => {
  it('renders WPM from props (eventually)', async () => {
    vi.useFakeTimers()
    render(
      <ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />
    )
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByTestId('result-wpm').textContent).toBe('80')
    vi.useRealTimers()
  })

  it('renders accuracy from props (eventually)', async () => {
    vi.useFakeTimers()
    render(
      <ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />
    )
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByTestId('result-acc').textContent).toBe('95%')
    vi.useRealTimers()
  })

  it('retry button calls onRetry', () => {
    const onRetry = vi.fn()
    render(<ResultOverlay result={mockResult} onRetry={onRetry} onHome={() => {}} />)
    fireEvent.click(screen.getByTestId('retry-button'))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('home button calls onHome', () => {
    const onHome = vi.fn()
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={onHome} />)
    fireEvent.click(screen.getByTestId('home-button'))
    expect(onHome).toHaveBeenCalledOnce()
  })

  it('Enter key triggers onRetry', () => {
    const onRetry = vi.fn()
    render(<ResultOverlay result={mockResult} onRetry={onRetry} onHome={() => {}} />)
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('backdrop has data-testid="result-backdrop"', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByTestId('result-backdrop')).toBeInTheDocument()
  })

  it('modal has data-testid="result-modal"', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByTestId('result-modal')).toBeInTheDocument()
  })

  it('WPM value has data-testid="result-wpm"', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByTestId('result-wpm')).toBeInTheDocument()
  })

  it('ACC value has data-testid="result-acc"', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByTestId('result-acc')).toBeInTheDocument()
  })

  it('char breakdown has data-testid="result-chars"', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByTestId('result-chars')).toBeInTheDocument()
  })

  it('retry button has data-testid="retry-button"', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByTestId('retry-button')).toBeInTheDocument()
  })

  it('home button has data-testid="home-button"', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByTestId('home-button')).toBeInTheDocument()
  })

  it('"PLAY AGAIN?" text is present', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    expect(screen.getByText('PLAY AGAIN?')).toBeInTheDocument()
  })

  it('"PLAY AGAIN?" is not a button', () => {
    render(<ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />)
    const el = screen.getByText('PLAY AGAIN?')
    expect(el.tagName).not.toBe('BUTTON')
    expect(el).not.toHaveAttribute('role', 'button')
  })

  it('no img or icon svg renders in the overlay', () => {
    const { container } = render(
      <ResultOverlay result={mockResult} onRetry={() => {}} onHome={() => {}} />
    )
    expect(container.querySelectorAll('img')).toHaveLength(0)
    expect(container.querySelectorAll('svg[role="img"]')).toHaveLength(0)
  })
})
