import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../components/StatusBadge'

describe('StatusBadge', () => {
  it('renders the status text', () => {
    render(<StatusBadge status="Active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies green class for Active', () => {
    const { container } = render(<StatusBadge status="Active" />)
    expect(container.firstChild).toHaveClass('badge--green')
  })

  it('applies green class for Approved', () => {
    const { container } = render(<StatusBadge status="Approved" />)
    expect(container.firstChild).toHaveClass('badge--green')
  })

  it('applies yellow class for Pending', () => {
    const { container } = render(<StatusBadge status="Pending" />)
    expect(container.firstChild).toHaveClass('badge--yellow')
  })

  it('applies red class for Rejected', () => {
    const { container } = render(<StatusBadge status="Rejected" />)
    expect(container.firstChild).toHaveClass('badge--red')
  })

  it('applies gray class for Inactive', () => {
    const { container } = render(<StatusBadge status="Inactive" />)
    expect(container.firstChild).toHaveClass('badge--gray')
  })

  it('falls back to base badge class for unknown status', () => {
    const { container } = render(<StatusBadge status="Unknown" />)
    expect(container.firstChild).toHaveClass('badge')
  })
})
