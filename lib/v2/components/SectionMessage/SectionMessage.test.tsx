import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SECTION_MESSAGE_VARIANTS, SectionMessage } from './SectionMessage'

describe('SectionMessage', () => {
  it('renders the message text', () => {
    render(<SectionMessage message='Hello world' />)

    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders multiline text preserving newlines', () => {
    render(<SectionMessage message={'Line one\nLine two'} />)

    const message = screen.getByText(/Line one/)
    expect(message.textContent).toContain('Line one')
    expect(message.textContent).toContain('Line two')
  })

  it('renders an icon', () => {
    const { container } = render(<SectionMessage message='Test message' />)

    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders no label element by default', () => {
    render(<SectionMessage message='Test message' />)

    expect(screen.queryByText('Heads up')).not.toBeInTheDocument()
  })

  it('renders the label above the message when given', () => {
    render(
      <SectionMessage
        label='Heads up'
        message='Test message'
      />
    )

    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders an icon for the warning variant too', () => {
    const { container } = render(
      <SectionMessage
        message='Careful'
        variant={SECTION_MESSAGE_VARIANTS.WARNING}
      />
    )

    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('Careful')).toBeInTheDocument()
  })

  it('renders the message in compact mode', () => {
    render(
      <SectionMessage
        compact
        message='Compact message'
      />
    )

    expect(screen.getByText('Compact message')).toBeInTheDocument()
  })

  it('applies extraClass when provided', () => {
    const { container } = render(
      <SectionMessage
        extraClass='custom-class'
        message='Test'
      />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})
