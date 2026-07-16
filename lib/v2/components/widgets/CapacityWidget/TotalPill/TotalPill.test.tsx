import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TotalPill } from './TotalPill'

describe('TotalPill', () => {
  it('renders the label, value and unit', () => {
    render(
      <TotalPill
        amount={{ value: '718.7', unit: 'TB' }}
        label='Total Usable'
      />
    )

    expect(screen.getByText('Total Usable')).toBeInTheDocument()
    expect(screen.getByText('718.7')).toBeInTheDocument()
    expect(screen.getByText('TB')).toBeInTheDocument()
  })
})
