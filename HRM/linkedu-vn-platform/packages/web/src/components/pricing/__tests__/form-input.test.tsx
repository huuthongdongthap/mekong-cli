import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FormInput, FormSelect } from '@/components/dashboard/form-input'

describe('FormInput', () => {
  it('renders label and value', () => {
    const { getByText, getByDisplayValue } = render(
      <FormInput label="Name" value="abc" onChange={() => {}} />
    )
    expect(getByText('Name')).toBeInTheDocument()
    expect(getByDisplayValue('abc')).toBeInTheDocument()
  })

  it('renders a required marker', () => {
    const { getByText } = render(<FormInput label="Name" required value="" onChange={() => {}} />)
    expect(getByText('*')).toBeInTheDocument()
  })

  it('renders an error message', () => {
    const { getByText } = render(
      <FormInput label="Name" value="" error="bad" onChange={() => {}} />
    )
    expect(getByText('bad')).toBeInTheDocument()
  })
})

describe('FormSelect', () => {
  it('renders label and options', () => {
    const { getByText } = render(
      <FormSelect label="Type" value="A" onChange={() => {}}>
        <option value="A">A</option>
        <option value="B">B</option>
      </FormSelect>
    )
    expect(getByText('Type')).toBeInTheDocument()
    expect(getByText('A')).toBeInTheDocument()
    expect(getByText('B')).toBeInTheDocument()
  })
})