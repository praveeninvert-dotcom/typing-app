import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DifficultySelector } from './index'

type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  whileHover?: unknown
  whileTap?: unknown
  animate?: unknown
  transition?: unknown
}

function MotionButton({ children, whileHover, whileTap, animate, transition, ...props }: MotionButtonProps) {
  void whileHover; void whileTap; void animate; void transition
  return <button {...props}>{children}</button>
}

vi.mock('framer-motion', () => ({
  motion: { button: MotionButton },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

describe('DifficultySelector', () => {
  it('renders EASY, MEDIUM, HARD options', () => {
    render(<DifficultySelector value={null} onChange={() => {}} />)
    expect(screen.getByText('EASY')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    expect(screen.getByText('HARD')).toBeInTheDocument()
  })

  it('clicking a difficulty fires onChange with correct value', () => {
    const onChange = vi.fn()
    render(<DifficultySelector value={null} onChange={onChange} />)
    fireEvent.click(screen.getByTestId('difficulty-easy'))
    expect(onChange).toHaveBeenCalledWith('easy')
    fireEvent.click(screen.getByTestId('difficulty-medium'))
    expect(onChange).toHaveBeenCalledWith('medium')
    fireEvent.click(screen.getByTestId('difficulty-hard'))
    expect(onChange).toHaveBeenCalledWith('hard')
  })

  it('selected option has aria-checked="true"', () => {
    render(<DifficultySelector value="easy" onChange={() => {}} />)
    expect(screen.getByTestId('difficulty-easy')).toHaveAttribute('aria-checked', 'true')
  })

  it('unselected options have aria-checked="false"', () => {
    render(<DifficultySelector value="easy" onChange={() => {}} />)
    expect(screen.getByTestId('difficulty-medium')).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByTestId('difficulty-hard')).toHaveAttribute('aria-checked', 'false')
  })

  it('container has data-testid="difficulty-selector"', () => {
    render(<DifficultySelector value={null} onChange={() => {}} />)
    expect(screen.getByTestId('difficulty-selector')).toBeInTheDocument()
  })

  it('each card has correct data-testid', () => {
    render(<DifficultySelector value={null} onChange={() => {}} />)
    expect(screen.getByTestId('difficulty-easy')).toBeInTheDocument()
    expect(screen.getByTestId('difficulty-medium')).toBeInTheDocument()
    expect(screen.getByTestId('difficulty-hard')).toBeInTheDocument()
  })

  it('no element related to "stat-bar" or "progress" renders inside cards', () => {
    const { container } = render(<DifficultySelector value={null} onChange={() => {}} />)
    expect(container.querySelector('[role="progressbar"]')).toBeNull()
    expect(container.querySelector('.stat-bar')).toBeNull()
    expect(container.querySelector('progress')).toBeNull()
  })
})
