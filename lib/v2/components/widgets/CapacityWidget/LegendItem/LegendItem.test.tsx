import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LegendItem } from './LegendItem'

describe('LegendItem', () => {
  it('renders the label, value and unit', () => {
    render(
      <LegendItem
        amount={{ value: '406.5', unit: 'TB' }}
        label='Used'
      />
    )

    expect(screen.getByText('Used')).toBeInTheDocument()
    expect(screen.getByText('406.5')).toBeInTheDocument()
    expect(screen.getByText('TB')).toBeInTheDocument()
  })

  it('renders a colored dot when dotClass is provided', () => {
    const { container } = render(
      <LegendItem
        amount={{ value: '1', unit: 'PB' }}
        dotClass='my-dot'
        label='Written'
      />
    )

    expect(container.querySelector('.my-dot')).toBeInTheDocument()
  })

  it('omits the dot when dotClass is not provided', () => {
    const { container } = render(
      <LegendItem
        amount={{ value: '1', unit: 'PB' }}
        label='Provisioned'
      />
    )

    expect(container.querySelector('[class*="dot"]')).not.toBeInTheDocument()
  })

  it('applies an extra className to the root', () => {
    const { container } = render(
      <LegendItem
        amount={{ value: '1', unit: 'PB' }}
        className='extra'
        label='Total'
      />
    )

    expect(container.querySelector('.extra')).toBeInTheDocument()
  })
})
