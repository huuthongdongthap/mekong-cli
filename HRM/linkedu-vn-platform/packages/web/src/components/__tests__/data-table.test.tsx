import { render, screen, within, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DataTable } from '@/components/ui/data-table'

interface TestRow {
  id: number
  name: string
  score: number
}

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'score', label: 'Score', sortable: true },
]

const data: TestRow[] = [
  { id: 1, name: 'Alice', score: 90 },
  { id: 2, name: 'Bob', score: 80 },
  { id: 3, name: 'Charlie', score: 95 },
]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
  })

  it('renders row data', () => {
    render(<DataTable columns={columns} data={data} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('shows empty message when data is empty', () => {
    render(<DataTable columns={columns} data={[]} />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('shows custom empty message', () => {
    render(
      <DataTable columns={columns} data={[]} emptyMessage="Khong co du lieu" />
    )
    expect(screen.getByText('Khong co du lieu')).toBeInTheDocument()
  })

  it('shows loading state with skeleton elements', () => {
    const { container } = render(
      <DataTable columns={columns} data={[]} loading={true} />
    )
    expect(screen.queryByText('No data available')).not.toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    const skeletons = container.querySelectorAll('.animate-pulse')
    // 5 rows * 3 columns = 15 skeletons
    expect(skeletons.length).toBe(15)
  })

  it('calls onRowClick when a row is clicked', async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />)
    await user.click(screen.getByText('Alice'))
    expect(onRowClick).toHaveBeenCalledWith(data[0], 0)
  })

  it('sorts ascending when sortable header is clicked', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={data} />)
    await user.click(screen.getByText('Name'))
    const tbody = screen.getByRole('table').querySelector('tbody')!
    const rows = within(tbody).getAllByRole('row')
    expect(within(rows[0]).getByText('Alice')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Bob')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Charlie')).toBeInTheDocument()
  })

  it('sorts descending on second click of sortable header', async () => {
    render(<DataTable columns={columns} data={data} />)
    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader) // asc
    fireEvent.click(nameHeader) // desc
    await waitFor(() => {
      const tbody = screen.getByRole('table').querySelector('tbody')!
      const firstCell = within(tbody).getAllByRole('row')[0].querySelectorAll('td')[1]
      expect(firstCell).toHaveTextContent('Charlie')
    })
  })

  it('resets sort on third click of sortable header', async () => {
    render(<DataTable columns={columns} data={data} />)
    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader) // asc
    fireEvent.click(nameHeader) // desc
    fireEvent.click(nameHeader) // reset
    await waitFor(() => {
      const tbody = screen.getByRole('table').querySelector('tbody')!
      const firstCell = within(tbody).getAllByRole('row')[0].querySelectorAll('td')[1]
      expect(firstCell).toHaveTextContent('Alice')
    })
  })

  it('does not sort on click of non-sortable header', async () => {
    const nonSortableColumns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'score', label: 'Score' },
    ]
    render(<DataTable columns={nonSortableColumns} data={data} />)
    fireEvent.click(screen.getByText('Name'))
    const tbody = screen.getByRole('table').querySelector('tbody')!
    const rows = within(tbody).getAllByRole('row')
    expect(within(rows[0]).getByText('Alice')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Bob')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Charlie')).toBeInTheDocument()
  })

  it('sorts numeric columns correctly', async () => {
    render(<DataTable columns={columns} data={data} />)
    fireEvent.click(screen.getByText('Score'))
    await waitFor(() => {
      const tbody = screen.getByRole('table').querySelector('tbody')!
      const firstRow = within(tbody).getAllByRole('row')[0]
      expect(within(firstRow).getByText('80')).toBeInTheDocument()
    })
  })

  it('renders custom render function', () => {
    const customColumns = [
      {
        key: 'name',
        label: 'Name',
        render: (row: TestRow) => <strong>{row.name}</strong>,
      },
    ]
    render(<DataTable columns={customColumns} data={data} />)
    const strong = screen.getByText('Alice')
    expect(strong.tagName).toBe('STRONG')
  })
})
