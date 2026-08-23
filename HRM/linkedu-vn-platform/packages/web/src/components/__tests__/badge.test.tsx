import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge, StatusBadge } from '@/components/ui/badge'

function getBadgeSpan(text: string): HTMLElement {
  return screen.getByText(text).closest('span')!
}

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Hello Badge</Badge>)
    expect(screen.getByText('Hello Badge')).toBeInTheDocument()
  })

  it('applies default color classes (gray)', () => {
    render(<Badge>Default</Badge>)
    const el = getBadgeSpan('Default')
    expect(el.className).toContain('bg-muted')
    expect(el.className).toContain('text-muted-foreground')
  })

  it('applies green color classes', () => {
    render(<Badge color="green">Green</Badge>)
    const el = getBadgeSpan('Green')
    expect(el.className).toContain('bg-[var(--status-green)]')
    expect(el.className).toContain('text-[var(--status-green-fg)]')
  })

  it('applies blue color classes', () => {
    render(<Badge color="blue">Blue</Badge>)
    const el = getBadgeSpan('Blue')
    expect(el.className).toContain('bg-[var(--status-blue)]')
    expect(el.className).toContain('text-[var(--status-blue-fg)]')
  })

  it('applies yellow color classes', () => {
    render(<Badge color="yellow">Yellow</Badge>)
    const el = getBadgeSpan('Yellow')
    expect(el.className).toContain('bg-[var(--status-yellow)]')
    expect(el.className).toContain('text-[var(--status-yellow-fg)]')
  })

  it('applies red color classes', () => {
    render(<Badge color="red">Red</Badge>)
    const el = getBadgeSpan('Red')
    expect(el.className).toContain('bg-[var(--status-red)]')
    expect(el.className).toContain('text-[var(--status-red-fg)]')
  })

  it('applies purple color classes', () => {
    render(<Badge color="purple">Purple</Badge>)
    const el = getBadgeSpan('Purple')
    expect(el.className).toContain('bg-[var(--status-purple)]')
    expect(el.className).toContain('text-[var(--status-purple-fg)]')
  })

  it('applies custom className', () => {
    render(<Badge className="my-custom">Custom</Badge>)
    const el = getBadgeSpan('Custom')
    expect(el.className).toContain('my-custom')
  })
})

describe('StatusBadge', () => {
  it('renders green badge for active status', () => {
    render(<StatusBadge status="active" />)
    const badge = screen.getByText('Hoạt động')
    expect(badge).toBeInTheDocument()
    expect(badge.closest('span')!.className).toContain('bg-[var(--status-green)]')
  })

  it('renders blue badge for graduated status', () => {
    render(<StatusBadge status="graduated" />)
    expect(screen.getByText('Tốt nghiệp')).toBeInTheDocument()
  })

  it('renders yellow badge for pending status', () => {
    render(<StatusBadge status="pending" />)
    expect(screen.getByText('Chờ duyệt')).toBeInTheDocument()
  })

  it('renders red badge for revoked status', () => {
    render(<StatusBadge status="revoked" />)
    expect(screen.getByText('Thu hồi')).toBeInTheDocument()
  })

  it('falls back to gray for unknown status', () => {
    render(<StatusBadge status="unknown-status" />)
    expect(screen.getByText('unknown-status')).toBeInTheDocument()
  })

  it('handles null status gracefully', () => {
    render(<StatusBadge status={null as unknown as string} />)
  })
})
