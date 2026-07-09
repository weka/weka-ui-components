import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { StableChartContainer } from './StableChartContainer'

type ResizeCallback = (entries: { contentRect: DOMRectReadOnly }[]) => void

let resizeCallback: ResizeCallback

class ResizeObserverMock {
  constructor(callback: ResizeCallback) {
    resizeCallback = callback
  }

  observe = vi.fn()

  disconnect = vi.fn()

  unobserve = vi.fn()
}

const resizeTo = (width: number, height: number) => {
  act(() => {
    resizeCallback([{ contentRect: { width, height } as DOMRectReadOnly }])
  })
}

const CHILD_TEST_ID = 'child-chart'
const INITIAL_WIDTH = 600
const RESIZED_WIDTH = 700
const HEIGHT = 300
const SETTLE_MS = 150

function ChildChart({
  width,
  height
}: Readonly<{ width?: number; height?: number }>) {
  return <div data-testid={CHILD_TEST_ID}>{`${width}x${height}`}</div>
}

describe('StableChartContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('does not render the child until a non-zero size is measured', () => {
    render(
      <StableChartContainer>
        <ChildChart />
      </StableChartContainer>
    )

    expect(screen.queryByTestId(CHILD_TEST_ID)).not.toBeInTheDocument()
  })

  it('renders the child with the measured width and height immediately', () => {
    render(
      <StableChartContainer>
        <ChildChart />
      </StableChartContainer>
    )

    resizeTo(INITIAL_WIDTH, HEIGHT)

    expect(screen.getByTestId(CHILD_TEST_ID)).toHaveTextContent(
      `${INITIAL_WIDTH}x${HEIGHT}`
    )
  })

  it('debounces subsequent resizes until they settle', () => {
    render(
      <StableChartContainer>
        <ChildChart />
      </StableChartContainer>
    )
    resizeTo(INITIAL_WIDTH, HEIGHT)

    resizeTo(RESIZED_WIDTH, HEIGHT)
    expect(screen.getByTestId(CHILD_TEST_ID)).toHaveTextContent(
      `${INITIAL_WIDTH}x${HEIGHT}`
    )

    act(() => {
      vi.advanceTimersByTime(SETTLE_MS)
    })
    expect(screen.getByTestId(CHILD_TEST_ID)).toHaveTextContent(
      `${RESIZED_WIDTH}x${HEIGHT}`
    )
  })
})
