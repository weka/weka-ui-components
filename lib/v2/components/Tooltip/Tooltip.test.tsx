import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING, TOOLTIP_PLACEMENTS } from '../../utils/consts'

import { Tooltip } from './Tooltip'

describe('Tooltip - Rendering', () => {
  it('renders children', () => {
    render(
      <Tooltip data='Tooltip content'>
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('returns children without wrapper when data is empty string', () => {
    render(
      <Tooltip data={EMPTY_STRING}>
        <button>No tooltip</button>
      </Tooltip>
    )
    expect(
      screen.getByRole('button', { name: 'No tooltip' })
    ).toBeInTheDocument()
  })

  it('returns children without wrapper when data is undefined', () => {
    render(
      <Tooltip>
        <button>No tooltip</button>
      </Tooltip>
    )
    expect(
      screen.getByRole('button', { name: 'No tooltip' })
    ).toBeInTheDocument()
  })
})

describe('Tooltip - Behavior', () => {
  it('shows tooltip on hover', async () => {
    render(
      <Tooltip
        data='Tooltip text'
        enterDelay={0}
        enterNextDelay={0}
      >
        <button>Hover me</button>
      </Tooltip>
    )

    fireEvent.mouseOver(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText('Tooltip text')).toBeInTheDocument()
    })
  })

  it('hides tooltip when mouse leaves', async () => {
    render(
      <Tooltip
        data='Tooltip text'
        enterDelay={0}
        enterNextDelay={0}
      >
        <button>Hover me</button>
      </Tooltip>
    )

    fireEvent.mouseOver(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    fireEvent.mouseLeave(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  it('renders React element as tooltip content', async () => {
    render(
      <Tooltip
        data={<span data-testid='custom-content'>Custom content</span>}
        enterDelay={0}
      >
        <button>Hover me</button>
      </Tooltip>
    )

    fireEvent.mouseOver(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByText('Custom content')).toBeInTheDocument()
    })
  })
})

describe('Tooltip - Placement', () => {
  it.each([
    { placement: TOOLTIP_PLACEMENTS.TOP },
    { placement: TOOLTIP_PLACEMENTS.BOTTOM },
    { placement: TOOLTIP_PLACEMENTS.LEFT },
    { placement: TOOLTIP_PLACEMENTS.RIGHT }
  ])('renders with placement="$placement"', async ({ placement }) => {
    render(
      <Tooltip
        data='Tooltip text'
        enterDelay={0}
        placement={placement}
      >
        <button>Hover me</button>
      </Tooltip>
    )

    fireEvent.mouseOver(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })
  })
})

describe('Tooltip - FollowCursor', () => {
  it('accepts followCursor prop', async () => {
    render(
      <Tooltip
        data='Tooltip text'
        enterDelay={0}
        followCursor
      >
        <button>Hover me</button>
      </Tooltip>
    )

    fireEvent.mouseOver(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })
  })
})

describe('Tooltip - Custom Classes', () => {
  it('applies extraClass to tooltip', async () => {
    render(
      <Tooltip
        data='Tooltip text'
        enterDelay={0}
        extraClass='custom-tooltip'
      >
        <button>Hover me</button>
      </Tooltip>
    )

    fireEvent.mouseOver(screen.getByRole('button'))

    await waitFor(() => {
      const tooltipContent = screen.getByText('Tooltip text')
      expect(tooltipContent).toHaveClass('custom-tooltip')
    })
  })

  it('applies clear style when clear prop is true', async () => {
    render(
      <Tooltip
        clear
        data='Tooltip text'
        enterDelay={0}
      >
        <button>Hover me</button>
      </Tooltip>
    )

    fireEvent.mouseOver(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })
  })
})

describe('Tooltip - DataTestId', () => {
  it('applies dataTestId to wrapper span', () => {
    render(
      <Tooltip
        data='Tooltip text'
        dataTestId='tooltip-trigger'
      >
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument()
  })
})
