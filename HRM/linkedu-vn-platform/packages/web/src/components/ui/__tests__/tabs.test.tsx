import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { TabsRoot, TabList, Tab, TabPanel } from '@/components/ui/tabs'

describe('Tabs', () => {
  it('renders tabs and panels, activating the default value', () => {
    render(
      <TabsRoot defaultValue="one">
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">First panel</TabPanel>
        <TabPanel value="two">Second panel</TabPanel>
      </TabsRoot>
    )
    expect(screen.getByText('First panel')).toBeInTheDocument()
    expect(screen.queryByText('Second panel')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true')
  })

  it('switches active panel on click', async () => {
    const user = userEvent.setup()
    render(
      <TabsRoot defaultValue="one">
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">First panel</TabPanel>
        <TabPanel value="two">Second panel</TabPanel>
      </TabsRoot>
    )
    await user.click(screen.getByRole('tab', { name: 'Two' }))
    expect(screen.getByText('Second panel')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
  })

  it('applies the primary border token on the selected tab', () => {
    render(
      <TabsRoot defaultValue="one">
        <TabList>
          <Tab value="one">One</Tab>
        </TabList>
        <TabPanel value="one">x</TabPanel>
      </TabsRoot>
    )
    expect(screen.getByRole('tab', { name: 'One' }).className).toContain('border-primary')
  })
})