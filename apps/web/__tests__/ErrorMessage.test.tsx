import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorMessage from '../components/ErrorMessage'

describe('ErrorMessage', () => {
  it('renders the message', () => {
    render(<ErrorMessage message="Something failed" />)
    expect(screen.getByText('Something failed')).toBeInTheDocument()
  })

  it('renders default title when none provided', () => {
    render(<ErrorMessage message="oops" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(<ErrorMessage title="Dashboard unavailable" message="API error 401" />)
    expect(screen.getByText('Dashboard unavailable')).toBeInTheDocument()
  })

  it('has role=alert for accessibility', () => {
    render(<ErrorMessage message="error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
