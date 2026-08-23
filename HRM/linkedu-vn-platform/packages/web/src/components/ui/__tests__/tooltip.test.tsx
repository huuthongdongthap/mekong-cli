import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Tooltip } from '@/components/ui/tooltip'

describe('Tooltip', () => {
  it('attaches the data-tooltip-trigger attribute to the trigger child', () => {
    render(
      <Tooltip content="hint">
        <button>Hover me</button>
      </Tooltip>
    )
    const btn = screen.getByRole('button', { name: 'Hover me' })
    expect(btn).toHaveAttribute('data-tooltip-trigger')
  })

  it('forwards the custom className to the popup and the trigger', () => {
    render(
      <Tooltip content="hint" className="tooltip-custom" defaultOpen>
        <button>Hover me</button>
      </Tooltip>
    )
    const btn = screen.getByRole('button', { name: 'Hover me' })
    expect(btn.className).toContain('tooltip-custom')
    const popup = screen.getByText('hint')
    expect(popup.className).toContain('tooltip-custom')
    expect(popup.className).toContain('bg-popover')
  })
})