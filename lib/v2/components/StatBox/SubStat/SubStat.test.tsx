import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { SubStat } from './SubStat'

describe('SubStat', () => {
  it('renders the label and value', () => {
    render(
      <SubStat
        label='Active'
        value={61}
      />
    )

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('61')).toBeInTheDocument()
  })

  it('renders the unit when provided', () => {
    render(
      <SubStat
        label='Read'
        unit='MB/s'
        value='132.0'
      />
    )

    expect(screen.getByText('132.0')).toBeInTheDocument()
    expect(screen.getByText('MB/s')).toBeInTheDocument()
  })

  it('omits the unit when not provided', () => {
    const { container } = render(
      <SubStat
        label='Inactive'
        value={3}
      />
    )

    expect(container.textContent).toBe('Inactive3')
  })

  it('renders the label as a plain span, with no ellipsis wrapper, by default', () => {
    render(
      <SubStat
        label='Active'
        value={61}
      />
    )

    expect(screen.getByText('Active')).not.toHaveClass('ellipsisWrapper')
  })

  it('wraps the label in an ellipsis tooltip when labelTooltip is set', () => {
    render(
      <SubStat
        label='default → very-long-peer-name'
        labelTooltip='default → very-long-peer-name'
        value={EMPTY_STRING}
      />
    )

    const labelElement = screen.getByText('default → very-long-peer-name')

    expect(labelElement).toHaveClass('ellipsisWrapper')
    expect(labelElement).toHaveClass('subStatLabel')
  })
})
