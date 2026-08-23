import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button, buttonVariants } from '@/components/ui/button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders with default variant classes', () => {
    render(<Button>Default</Button>)
    const el = screen.getByRole('button', { name: 'Default' })
    expect(el.className).toContain('bg-primary')
    expect(el.className).toContain('text-primary-foreground')
  })

  it('renders with secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const el = screen.getByRole('button', { name: 'Secondary' })
    expect(el.className).toContain('bg-secondary')
    expect(el.className).toContain('text-secondary-foreground')
  })

  it('renders with destructive variant classes', () => {
    render(<Button variant="destructive">Destructive</Button>)
    const el = screen.getByRole('button', { name: 'Destructive' })
    expect(el.className).toContain('text-destructive')
  })

  it('renders with outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    const el = screen.getByRole('button', { name: 'Outline' })
    expect(el.className).toContain('border-[var(--btn-outline-border)]')
    expect(el.className).toContain('bg-[var(--btn-outline-bg)]')
  })

  it('renders with ghost variant classes', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const el = screen.getByRole('button', { name: 'Ghost' })
    expect(el.className).toContain('hover:bg-[var(--btn-ghost-bg-hover)]')
  })

  it('renders with link variant classes', () => {
    render(<Button variant="link">Link</Button>)
    const el = screen.getByRole('button', { name: 'Link' })
    expect(el.className).toContain('underline')
  })

  it('handles onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Click' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders as disabled button', () => {
    render(<Button disabled>Disabled</Button>)
    const el = screen.getByRole('button', { name: 'Disabled' })
    expect(el).toBeDisabled()
    expect(el.className).toContain('disabled:opacity-50')
  })

  it('renders with different sizes', () => {
    render(<Button size="sm">Sm</Button>)
    expect(screen.getByRole('button', { name: 'Sm' }).className).toContain('h-7')

    render(<Button size="lg">Lg</Button>)
    expect(screen.getByRole('button', { name: 'Lg' }).className).toContain('h-9')

    render(<Button size="xs">Xs</Button>)
    expect(screen.getByRole('button', { name: 'Xs' }).className).toContain('h-6')
  })
})

describe('buttonVariants', () => {
  it('returns correct class string for default variant', () => {
    const classes = buttonVariants({ variant: 'default', size: 'default' })
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('h-8')
  })

  it('accepts custom className', () => {
    const classes = buttonVariants({ variant: 'default', className: 'extra-class' })
    expect(classes).toContain('extra-class')
  })
})
