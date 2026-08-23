import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmptyState } from '@/components/ui/empty-state'
import { FileX } from 'lucide-react'

describe('EmptyState', () => {
  it('renders title and description text', () => {
    render(<EmptyState title="No data" description="Nothing here yet" />)
    expect(screen.getByText('No data')).toBeInTheDocument()
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('renders an action button when provided', () => {
    render(<EmptyState title="Empty" description="desc" action={<button>Add item</button>} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('renders a custom icon when provided', () => {
    const { container } = render(
      <EmptyState title="x" description="y" icon={<FileX data-testid="my-icon" />} />
    )
    expect(container.querySelector('[data-testid="my-icon"]')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(<EmptyState title="t" description="d" className="empty-test" />)
    expect(container.firstChild).toHaveClass('empty-test')
  })
})