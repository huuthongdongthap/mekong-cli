import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparatorItem,
  DropdownCheckItem,
} from '@/components/ui/dropdown-menu'

describe('DropdownMenu', () => {
  it('renders items with popover token classes when open', () => {
    render(
      <DropdownRoot open>
        <DropdownContent>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
        </DropdownContent>
      </DropdownRoot>
    )
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
    const viewport = screen.getByText('Edit').closest('[class*="min-w"]') ?? screen.getByText('Edit').parentElement?.parentElement
    expect(viewport?.className).toContain('bg-popover')
    expect(viewport?.className).toContain('border-border')
  })

  it('renders a label and a separator', () => {
    const { container } = render(
      <DropdownRoot open>
        <DropdownContent>
          <DropdownLabel>Actions</DropdownLabel>
          <DropdownSeparatorItem />
          <DropdownItem>Save</DropdownItem>
        </DropdownContent>
      </DropdownRoot>
    )
    expect(screen.getByText('Actions')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('renders a check item with a leading indicator slot', () => {
    render(
      <DropdownRoot open>
        <DropdownContent>
          <DropdownCheckItem checked>Pinned</DropdownCheckItem>
        </DropdownContent>
      </DropdownRoot>
    )
    expect(screen.getByText('Pinned')).toBeInTheDocument()
  })

  it('closes when an item is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DropdownRoot>
        <DropdownTrigger>open</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Do it</DropdownItem>
        </DropdownContent>
      </DropdownRoot>
    )
    fireEvent.click(screen.getByRole('button', { name: 'open' }))
    fireEvent.click(screen.getByText('Do it'))
    expect(screen.getByRole('button', { name: 'open' })).toHaveAttribute('aria-expanded', 'false')
  })
})