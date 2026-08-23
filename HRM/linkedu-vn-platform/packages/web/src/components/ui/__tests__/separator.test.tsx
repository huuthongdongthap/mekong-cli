import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Separator } from '@/components/ui/separator'

describe('Separator', () => {
  it('renders a separator with the bg-border token class', () => {
    const { container } = render(<Separator />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-border')
    expect(el.className).toContain('shrink-0')
  })

  it('merges a custom className', () => {
    const { container } = render(<Separator className="custom-sep" />)
    expect((container.firstChild as HTMLElement).className).toContain('custom-sep')
  })
})