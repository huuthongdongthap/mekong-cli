import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogPopup,
  DialogHeader,
  DialogFooter,
  DialogCloseButton,
  DialogTitle,
} from '@/components/ui/dialog'

describe('Dialog', () => {
  it('renders a popup with the card token classes when open', () => {
    render(
      <DialogRoot open>
        <DialogTrigger>open</DialogTrigger>
        <DialogPortal>
          <DialogPopup>
            <DialogTitle>Title</DialogTitle>
          </DialogPopup>
        </DialogPortal>
      </DialogRoot>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    const popup = screen.getByText('Title').closest('[class*="max-w"]') ?? screen.getByText('Title').parentElement
    expect(popup?.className).toContain('bg-card')
    expect(popup?.className).toContain('border-border')
  })

  it('renders header and footer with border tokens', () => {
    render(
      <DialogRoot open>
        <DialogTrigger>open</DialogTrigger>
        <DialogPortal>
          <DialogPopup>
            <DialogHeader>Header</DialogHeader>
            <DialogFooter>Footer</DialogFooter>
          </DialogPopup>
        </DialogPortal>
      </DialogRoot>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('closes via the close button', async () => {
    const user = userEvent.setup()
    render(
      <DialogRoot>
        <DialogTrigger>open</DialogTrigger>
        <DialogPortal>
          <DialogPopup>
            <DialogCloseButton />
          </DialogPopup>
        </DialogPortal>
      </DialogRoot>
    )
    await user.click(screen.getByRole('button', { name: 'open' }))
    fireEvent.click(screen.getByRole('button', { name: 'Đóng' }))
    expect(screen.queryByRole('button', { name: 'Đóng' })).not.toBeInTheDocument()
  })
})