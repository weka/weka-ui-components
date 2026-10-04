import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FieldWrapper } from './FieldWrapper'

const FIELD_ID = 'field-id'
const LABEL_TEXT = 'Name'
const CHILD_TEXT = 'child'

describe('FieldWrapper', () => {
  it('renders children without a label row when no label or info is given', () => {
    render(<FieldWrapper>{CHILD_TEXT}</FieldWrapper>)

    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument()
    expect(screen.queryByText(LABEL_TEXT)).not.toBeInTheDocument()
  })

  it('renders a label element bound to htmlFor when provided', () => {
    render(
      <FieldWrapper
        htmlFor={FIELD_ID}
        label={LABEL_TEXT}
      >
        <input id={FIELD_ID} />
      </FieldWrapper>
    )

    expect(screen.getByLabelText(LABEL_TEXT)).toBe(screen.getByRole('textbox'))
  })

  it('renders a plain span label when htmlFor is omitted', () => {
    render(<FieldWrapper label={LABEL_TEXT}>{CHILD_TEXT}</FieldWrapper>)

    expect(screen.getByText(LABEL_TEXT).tagName).toBe('SPAN')
  })

  it('renders the required marker inside the label', () => {
    render(
      <FieldWrapper
        label={LABEL_TEXT}
        required
      >
        {CHILD_TEXT}
      </FieldWrapper>
    )

    expect(screen.getByText(LABEL_TEXT)).toHaveTextContent('*')
  })

  it('applies labelClassName in place of the default label class', () => {
    render(
      <FieldWrapper
        label={LABEL_TEXT}
        labelClassName='customLabel'
      >
        {CHILD_TEXT}
      </FieldWrapper>
    )

    expect(screen.getByText(LABEL_TEXT)).toHaveClass('customLabel')
    expect(screen.getByText(LABEL_TEXT)).not.toHaveClass('labelText')
  })

  it('renders the error text', () => {
    render(<FieldWrapper error='Invalid value'>{CHILD_TEXT}</FieldWrapper>)

    expect(screen.getByText('Invalid value')).toBeInTheDocument()
  })
})
