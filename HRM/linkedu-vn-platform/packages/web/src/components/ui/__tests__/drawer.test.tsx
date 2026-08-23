import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerViewport,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerCloseButton,
  DrawerTitle,
} from '@/components/ui/drawer'

describe('Drawer', () => {
  it('renders content with card tokens when open', () => {
    render(
      <DrawerRoot open>
        <DrawerTrigger>open</DrawerTrigger>
        <DrawerPortal>
          <DrawerViewport>
            <DrawerContent>
              <DrawerTitle>Side panel</DrawerTitle>
            </DrawerContent>
          </DrawerViewport>
        </DrawerPortal>
      </DrawerRoot>
    )
    expect(screen.getByText('Side panel')).toBeInTheDocument()
    const el = screen.getByText('Side panel').closest('[class*="inset"]') ?? screen.getByText('Side panel').parentElement
    expect(el?.className).toContain('bg-card')
    expect(el?.className).toContain('border-border')
  })

  it('renders header and footer with border tokens', () => {
    render(
      <DrawerRoot open>
        <DrawerTrigger>open</DrawerTrigger>
        <DrawerPortal>
          <DrawerViewport>
            <DrawerContent>
              <DrawerHeader>Header</DrawerHeader>
              <DrawerFooter>Footer</DrawerFooter>
            </DrawerContent>
          </DrawerViewport>
        </DrawerPortal>
      </DrawerRoot>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('closes via the close button', async () => {
    const user = userEvent.setup()
    render(
      <DrawerRoot>
        <DrawerTrigger>open</DrawerTrigger>
        <DrawerPortal>
          <DrawerContent>
            <DrawerCloseButton />
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    )
    await user.click(screen.getByRole('button', { name: 'open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Đóng' }))
    expect(screen.getByRole('button', { name: 'open' })).toHaveAttribute('aria-expanded', 'false')
  })
})