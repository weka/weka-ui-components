import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ALLOCATION_SEGMENT_TONES, AllocationBar } from './AllocationBar'

const TEST_ID = 'ssd-allocation'

const BASE_SEGMENTS = [
  {
    id: 'used',
    label: 'Used',
    value: 60,
    valueDisplay: '60 TB',
    tone: ALLOCATION_SEGMENT_TONES.USED
  },
  {
    id: 'thisFs',
    label: 'This Filesystem',
    value: 10,
    valueDisplay: '10 TB',
    tone: ALLOCATION_SEGMENT_TONES.PRIMARY
  },
  {
    id: 'free',
    label: 'Free',
    value: 30,
    valueDisplay: '30 TB',
    tone: ALLOCATION_SEGMENT_TONES.FREE
  }
]

describe('AllocationBar', () => {
  it('renders a legend entry per segment with label and value', () => {
    render(
      <AllocationBar
        segments={BASE_SEGMENTS}
        total={100}
      />
    )

    expect(screen.getByText('Used')).toBeInTheDocument()
    expect(screen.getByText('60 TB')).toBeInTheDocument()
    expect(screen.getByText('This Filesystem')).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('30 TB')).toBeInTheDocument()
  })

  it('renders bar slices sized by value share, excluding FREE segments', () => {
    render(
      <AllocationBar
        dataTestId={TEST_ID}
        segments={BASE_SEGMENTS}
        total={100}
      />
    )

    expect(screen.getByTestId(`${TEST_ID}-segment-used`).style.width).toBe(
      '60%'
    )
    expect(screen.getByTestId(`${TEST_ID}-segment-thisFs`).style.width).toBe(
      '10%'
    )
    expect(
      screen.queryByTestId(`${TEST_ID}-segment-free`)
    ).not.toBeInTheDocument()
    expect(screen.getByTestId(`${TEST_ID}-legend-free`)).toBeInTheDocument()
  })

  it('clamps slice widths so the bar never exceeds 100%', () => {
    const overflowingSegments = [
      { ...BASE_SEGMENTS[0], value: 80 },
      { ...BASE_SEGMENTS[1], value: 50 }
    ]
    render(
      <AllocationBar
        dataTestId={TEST_ID}
        segments={overflowingSegments}
        total={100}
      />
    )

    expect(screen.getByTestId(`${TEST_ID}-segment-used`).style.width).toBe(
      '80%'
    )
    expect(screen.getByTestId(`${TEST_ID}-segment-thisFs`).style.width).toBe(
      '20%'
    )
  })

  it('omits slices for zero-value segments but keeps their legend entry', () => {
    const segmentsWithZero = [
      BASE_SEGMENTS[0],
      { ...BASE_SEGMENTS[1], value: 0 }
    ]
    render(
      <AllocationBar
        dataTestId={TEST_ID}
        segments={segmentsWithZero}
        total={100}
      />
    )

    expect(
      screen.queryByTestId(`${TEST_ID}-segment-thisFs`)
    ).not.toBeInTheDocument()
    expect(screen.getByTestId(`${TEST_ID}-legend-thisFs`)).toBeInTheDocument()
  })

  it('renders no slices when total is zero', () => {
    render(
      <AllocationBar
        dataTestId={TEST_ID}
        segments={BASE_SEGMENTS}
        total={0}
      />
    )

    expect(
      screen.queryByTestId(`${TEST_ID}-segment-used`)
    ).not.toBeInTheDocument()
  })

  it('renders the header label and right-aligned total label', () => {
    render(
      <AllocationBar
        label='Cluster SSD Allocation'
        segments={BASE_SEGMENTS}
        total={100}
        totalLabel='100 TB total'
      />
    )

    expect(screen.getByText('Cluster SSD Allocation')).toBeInTheDocument()
    expect(screen.getByText('100 TB total')).toBeInTheDocument()
  })

  it('renders the error message as an alert with error styling', () => {
    const errorSegments = [
      BASE_SEGMENTS[0],
      { ...BASE_SEGMENTS[1], tone: ALLOCATION_SEGMENT_TONES.ERROR }
    ]
    render(
      <AllocationBar
        dataTestId={TEST_ID}
        errorMessage='Exceeds free SSD capacity by 3.44 TB.'
        segments={errorSegments}
        total={100}
      />
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Exceeds free SSD capacity by 3.44 TB.')
    expect(screen.getByTestId(`${TEST_ID}-segment-thisFs`).className).toMatch(
      /error/
    )
  })

  it('renders no alert when errorMessage is absent', () => {
    render(
      <AllocationBar
        segments={BASE_SEGMENTS}
        total={100}
      />
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('applies extraClass to the container', () => {
    const EXTRA = 'custom-allocation'
    const { container } = render(
      <AllocationBar
        extraClass={EXTRA}
        segments={BASE_SEGMENTS}
        total={100}
      />
    )

    expect(container.querySelector(`.${EXTRA}`)).toBeInTheDocument()
  })
})
