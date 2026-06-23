import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CollapsibleText } from './CollapsibleText'

describe('CollapsibleText', () => {
  it('renders the provided text', () => {
    render(<CollapsibleText text='Drive reported elevated error rates.' />)
    expect(
      screen.getByText('Drive reported elevated error rates.')
    ).toBeInTheDocument()
  })

  it('honors a custom dataTestId', () => {
    render(
      <CollapsibleText
        dataTestId='alert-description'
        text='Some description'
      />
    )
    expect(screen.getByTestId('alert-description')).toBeInTheDocument()
  })
})
