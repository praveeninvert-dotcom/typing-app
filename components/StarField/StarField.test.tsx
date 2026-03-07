import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StarField } from './StarField'

vi.mock('next/font/google', () => ({
  Press_Start_2P: () => ({ className: 'mock-press-start' }),
  VT323: () => ({ className: 'mock-vt323' }),
}))

describe('StarField', () => {
  it('renders without errors', () => {
    render(<StarField />)
    expect(screen.getByTestId('star-field')).toBeInTheDocument()
  })

  it('renders exactly 3 layer divs', () => {
    const { container } = render(<StarField />)
    const starField = screen.getByTestId('star-field')
    // Direct children are the 3 layer divs
    expect(starField.children).toHaveLength(3)
  })

  it('has aria-hidden="true" (decorative, not announced)', () => {
    render(<StarField />)
    expect(screen.getByTestId('star-field')).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not render any interactive elements', () => {
    const { container } = render(<StarField />)
    expect(container.querySelectorAll('button')).toHaveLength(0)
    expect(container.querySelectorAll('a')).toHaveLength(0)
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(0)
  })
})
