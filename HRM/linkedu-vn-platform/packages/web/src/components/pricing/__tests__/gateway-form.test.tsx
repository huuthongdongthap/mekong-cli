import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GatewayForm } from '@/components/pricing/gateway-form'

const { create, onCreated } = vi.hoisted(() => ({
  create: vi.fn(() => Promise.resolve({ data: { id: 'g1' } })),
  onCreated: vi.fn(),
}))

vi.mock('@/lib/api/pricing', () => ({
  pricingGateways: { create },
}))

describe('GatewayForm', () => {
  it('renders the header and a collapsed form', () => {
    render(<GatewayForm onCreated={onCreated} />)
    expect(screen.getByText('Cổng thanh toán')).toBeInTheDocument()
    // The inline form is collapsed until the toggle is pressed.
    expect(screen.queryByPlaceholderText('Ví dụ: MoMo Gateway')).not.toBeInTheDocument()
  })

  it('creates a gateway and calls onCreated', async () => {
    render(<GatewayForm onCreated={onCreated} />)

    // Show the form via the toggle button.
    const toggle = screen.getByRole('button', { name: 'Thêm' })
    fireEvent.click(toggle)

    const nameInput = screen.getByPlaceholderText('Ví dụ: MoMo Gateway')
    fireEvent.change(nameInput, { target: { value: 'MoMo' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tạo' }))

    await waitFor(() => expect(create).toHaveBeenCalledTimes(1))
    expect(create).toHaveBeenCalledWith({
      name: 'MoMo', type: 'MOMO', config: {}, isTestMode: true,
    })
    await waitFor(() => expect(onCreated).toHaveBeenCalled())
  })
})