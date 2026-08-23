import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
} from '@/components/ui/popover'

describe('Popover', () => {
  it('renders popup content with card tokens when open', () => {
    render(
      <PopoverRoot open>
        <PopoverContent>
          <span>inside</span>
        </PopoverContent>
      </PopoverRoot>
    )
    expect(screen.getByText('inside')).toBeInTheDocument()
    const el = screen.getByText('inside').closest('[class*="rounded"]')
    expect(el?.className).toContain('bg-popover')
    expect(el?.className).toContain('border-border')
  })

  it('renders header and close button with aria label', () => {
    render(
      <PopoverRoot open>
        <PopoverContent>
          <PopoverHeader>
            <span>Header</span>
            <PopoverCloseButton />
          </PopoverHeader>
        </PopoverContent>
      </PopoverRoot>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đóng' })).toBeInTheDocument()
  })

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <PopoverRoot>
        <PopoverTrigger>open</PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
        </PopoverContent>
      </PopoverRoot>
    )
    fireEvent.click(screen.getByRole('button', { name: 'open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Đóng' }))
    expect(screen.getByRole('button', { name: 'open' })).toHaveAttribute('aria-expanded', 'false')
  })
})