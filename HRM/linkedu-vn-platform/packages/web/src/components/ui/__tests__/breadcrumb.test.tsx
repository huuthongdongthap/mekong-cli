import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Breadcrumb } from '@/components/ui/breadcrumb'

describe('Breadcrumb', () => {
  it('renders a nav with an aria-label', () => {
    render(
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Programs' }]} />
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('renders links for items with href and a plain span for the last item', () => {
    render(
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Programs' }]} />
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Programs')).toBeInTheDocument()
    expect(screen.getByText('Programs').tagName).toBe('SPAN')
  })

  it('renders a separator between items', () => {
    const { container } = render(
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Programs' }]} />
    )
    expect(container.querySelector('svg.lucide-chevron-right')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    const { container } = render(
      <Breadcrumb items={[{ label: 'Home' }]} className="bc-test" />
    )
    expect(container.firstChild).toHaveClass('bc-test')
  })
})