import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  SheetRoot,
  SheetTrigger,
  SheetPortal,
  SheetViewport,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetCloseButton,
  SheetTitle,
} from '@/components/ui/sheet'

describe('Sheet', () => {
  it('renders content covering the full viewport with card tokens when open', () => {
    render(
      <SheetRoot open>
        <SheetTrigger>open</SheetTrigger>
        <SheetPortal>
          <SheetViewport>
            <SheetContent>
              <SheetTitle>Mobile menu</SheetTitle>
            </SheetContent>
          </SheetViewport>
        </SheetPortal>
      </SheetRoot>
    )
    expect(screen.getByText('Mobile menu')).toBeInTheDocument()
    const el = screen.getByText('Mobile menu').closest('[class*="inset"]')
    expect(el?.className).toContain('bg-card')
    expect(el?.className).toContain('border-border')
    expect(el?.className).toContain('z-50')
  })

  it('renders header and footer with border tokens', () => {
    render(
      <SheetRoot open>
        <SheetTrigger>open</SheetTrigger>
        <SheetPortal>
          <SheetViewport>
            <SheetContent>
              <SheetHeader>Header</SheetHeader>
              <SheetFooter>Footer</SheetFooter>
            </SheetContent>
          </SheetViewport>
        </SheetPortal>
      </SheetRoot>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('closes via the close button', async () => {
    const user = userEvent.setup()
    render(
      <SheetRoot>
        <SheetTrigger>open</SheetTrigger>
        <SheetPortal>
          <SheetContent>
            <SheetCloseButton />
          </SheetContent>
        </SheetPortal>
      </SheetRoot>
    )
    await user.click(screen.getByRole('button', { name: 'open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Đóng' }))
    expect(screen.getByRole('button', { name: 'open' })).toHaveAttribute('aria-expanded', 'false')
  })
})