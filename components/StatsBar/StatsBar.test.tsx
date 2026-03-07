import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsBar } from './index'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}))

const defaultProps = {
  wpm: 0,
  timeLeft: 60,
  accuracy: null,
  started: false,
  timeWarning: false,
}

describe('StatsBar', () => {
  it('WPM shows 0 before started', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.getByTestId('stat-wpm').textContent).toBe('0')
  })

  it('accuracy shows — before first char', () => {
    render(<StatsBar {...defaultProps} accuracy={null} />)
    expect(screen.getByTestId('stat-acc').textContent).toBe('—')
  })

  it('TIME shows 60 on mount', () => {
    render(<StatsBar {...defaultProps} timeLeft={60} />)
    expect(screen.getByTestId('stat-time').textContent).toBe('60')
  })

  it('has data-testid="stats-bar"', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.getByTestId('stats-bar')).toBeInTheDocument()
  })

  it('renders exactly 3 column children', () => {
    render(<StatsBar {...defaultProps} />)
    const bar = screen.getByTestId('stats-bar')
    expect(bar.children).toHaveLength(3)
  })

  it('WPM column has data-testid="stat-wpm"', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.getByTestId('stat-wpm')).toBeInTheDocument()
  })

  it('TIME column has data-testid="stat-time"', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.getByTestId('stat-time')).toBeInTheDocument()
  })

  it('ACC column has data-testid="stat-acc"', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.getByTestId('stat-acc')).toBeInTheDocument()
  })

  it('WPM label text is "WPM"', () => {
    render(<StatsBar {...defaultProps} />)
    // The label is a sibling span to stat-wpm
    const wpmCol = screen.getByTestId('stat-wpm').parentElement!
    expect(wpmCol.textContent).toContain('WPM')
  })

  it('TIME label text is "TIME"', () => {
    render(<StatsBar {...defaultProps} />)
    const timeCol = screen.getByTestId('stat-time').parentElement!
    expect(timeCol.textContent).toContain('TIME')
  })

  it('ACC label text is "ACC"', () => {
    render(<StatsBar {...defaultProps} />)
    const accCol = screen.getByTestId('stat-acc').parentElement!
    expect(accCol.textContent).toContain('ACC')
  })

  it('accuracy shows percentage when provided', () => {
    render(<StatsBar {...defaultProps} accuracy={95} />)
    expect(screen.getByTestId('stat-acc').textContent).toBe('95%')
  })

  it('no element with sound-related text renders', () => {
    render(<StatsBar {...defaultProps} />)
    expect(screen.queryByText(/SOUND/i)).toBeNull()
    expect(screen.queryByText(/SFX/i)).toBeNull()
  })
})
