import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppShell } from '@/components/layout/app-shell'

const replace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/',
}))

const { useAuthStore, __setMockState } = vi.hoisted(() => {
  const mockState = { current: {} as Record<string, unknown> }
  const fn = vi.fn(() => mockState.current) as ReturnType<
    typeof vi.fn<() => Record<string, unknown>>
  > & { getState: () => Record<string, unknown> }
  fn.getState = () => mockState.current
  return {
    useAuthStore: fn,
    __setMockState: (s: Record<string, unknown>) => {
      mockState.current = s
      fn.mockImplementation(() => s)
    },
  }
})

vi.mock('@/lib/auth-store', () => ({ useAuthStore, __setMockState }))

const baseState = (overrides: Record<string, unknown> = {}) => ({
  loading: false,
  user: null,
  initialized: true,
  hydrate: vi.fn(),
  logout: vi.fn(),
  token: null,
  ...overrides,
})

describe('AppShell', () => {
  beforeEach(() => {
    replace.mockClear()
    __setMockState(baseState())
  })

  it('renders a loading spinner while the store hydrates', () => {
    __setMockState(baseState({ loading: true, initialized: false }))
    const { container } = render(<AppShell>content</AppShell>)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders the top bar and main content when authenticated', async () => {
    __setMockState(
      baseState({
        user: { id: 'u1', email: 'a@b.com', role: 'school_admin', firstName: 'Thi', lastName: 'B' },
        token: 'tok',
      })
    )
    render(<AppShell>body</AppShell>)
    expect(await screen.findByText('body')).toBeInTheDocument()
    // The name appears in both the top-bar dropdown and the sidebar footer.
    expect(screen.getAllByText('Thi B').length).toBeGreaterThanOrEqual(1)
    // Skip-link target is present.
    expect(document.getElementById('main-content')).toBeInTheDocument()
  })

  it('redirects to /login when there is no token', async () => {
    __setMockState(baseState({ token: null, user: null }))
    render(<AppShell>body</AppShell>)
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'))
  })

  it('renders the mobile hamburger and closes the drawer on Escape', async () => {
    __setMockState(
      baseState({
        user: { id: 'u1', email: 'a@b.com', role: 'learner', firstName: 'Thi', lastName: 'B' },
        token: 'tok',
      })
    )
    render(<AppShell>body</AppShell>)
    const btn = await screen.findByRole('button', { name: 'Mở menu điều hướng' })
    fireEvent.click(btn)
    // Drawer content (nav) is now in the portal — duplicated with the desktop
    // sidebar, so assert the count rather than a single match.
    expect((await screen.findAllByText('Học tập')).length).toBeGreaterThanOrEqual(2)
    // Escape closes the drawer (Base UI Drawer handles this for free). The
    // drawer content stays mounted during its closing transition, so assert
    // the trigger's aria-expanded rather than the content being removed.
    fireEvent.keyDown(document.body, { key: 'Escape' })
    await waitFor(() => {
      expect(btn).toHaveAttribute('aria-expanded', 'false')
    })
  })
})