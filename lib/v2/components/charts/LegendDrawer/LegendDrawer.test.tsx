import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SERIES_TYPES, type SeriesConfig } from '../chartTypes'
import { LegendDrawer } from './LegendDrawer'

class ResizeObserverMock {
  observe = vi.fn()

  disconnect = vi.fn()

  unobserve = vi.fn()
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const CHECKBOX_TEST_ID = 'custom-checkbox'
const METRIC_A_KEY = 'metric-a'
const ALPHA_METRIC = 'Alpha Metric'
const BETA_METRIC = 'Beta Metric'
const CHARLIE_METRIC = 'Charlie Metric'
const RED_HEX = '#ff0000'
const GREEN_HEX = '#00ff00'
const BLUE_HEX = '#0000ff'
const VALUE_HEADER = 'Value'
const ALPHA_FORMATTED_VALUE = '100 MB'
const DRAWER_SELECTOR = 'div[class*="legendDrawer"]'

const mockSeries: SeriesConfig[] = [
  {
    key: METRIC_A_KEY,
    name: ALPHA_METRIC,
    color: RED_HEX,
    type: SERIES_TYPES.LINE
  },
  {
    key: 'metric-b',
    name: BETA_METRIC,
    color: GREEN_HEX,
    type: SERIES_TYPES.BAR
  },
  {
    key: 'metric-c',
    name: CHARLIE_METRIC,
    color: BLUE_HEX,
    type: SERIES_TYPES.AREA
  }
]

const mockSeriesWithValues: SeriesConfig[] = [
  {
    key: METRIC_A_KEY,
    name: ALPHA_METRIC,
    color: RED_HEX,
    type: SERIES_TYPES.LINE,
    value: 100,
    formattedValue: ALPHA_FORMATTED_VALUE
  },
  {
    key: 'metric-b',
    name: BETA_METRIC,
    color: GREEN_HEX,
    type: SERIES_TYPES.BAR,
    value: 50,
    formattedValue: '50 MB'
  },
  {
    key: 'metric-c',
    name: CHARLIE_METRIC,
    color: BLUE_HEX,
    type: SERIES_TYPES.AREA,
    value: 200,
    formattedValue: '200 MB'
  }
]

describe('LegendDrawer rendering', () => {
  it('renders all series items', () => {
    render(<LegendDrawer series={mockSeries} />)

    expect(screen.getByText(ALPHA_METRIC)).toBeInTheDocument()
    expect(screen.getByText(BETA_METRIC)).toBeInTheDocument()
    expect(screen.getByText(CHARLIE_METRIC)).toBeInTheDocument()
  })

  it('renders checkboxes by default', () => {
    render(<LegendDrawer series={mockSeries} />)

    const checkboxes = screen.getAllByTestId(CHECKBOX_TEST_ID)
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('hides checkboxes when showCheckboxes is false', () => {
    render(
      <LegendDrawer
        series={mockSeries}
        showCheckboxes={false}
      />
    )

    const checkboxes = screen.queryAllByTestId(CHECKBOX_TEST_ID)
    expect(checkboxes).toHaveLength(0)
  })

  it('renders values when showValues is true', () => {
    render(
      <LegendDrawer
        series={mockSeriesWithValues}
        showValues
      />
    )

    expect(screen.getByText(ALPHA_FORMATTED_VALUE)).toBeInTheDocument()
    expect(screen.getByText('50 MB')).toBeInTheDocument()
    expect(screen.getByText('200 MB')).toBeInTheDocument()
  })

  it('does not render values by default', () => {
    render(<LegendDrawer series={mockSeriesWithValues} />)

    expect(screen.queryByText(ALPHA_FORMATTED_VALUE)).not.toBeInTheDocument()
  })

  it('renders total item when includeTotal is true', () => {
    const totalItem: SeriesConfig = {
      key: 'total',
      name: 'Total',
      color: '#000000',
      type: SERIES_TYPES.LINE,
      formattedValue: '350 MB'
    }

    render(
      <LegendDrawer
        includeTotal
        series={mockSeriesWithValues}
        showValues
        totalItem={totalItem}
      />
    )

    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('350 MB')).toBeInTheDocument()
  })
})

describe('LegendDrawer sorting', () => {
  it('sorts series alphabetically by name by default (ascending)', () => {
    render(<LegendDrawer series={mockSeries} />)

    const labels = screen.getAllByText(/Metric$/)
    const names = labels.map((label) => label.textContent)

    expect(names).toEqual([ALPHA_METRIC, BETA_METRIC, CHARLIE_METRIC])
  })

  it('toggles sort order when clicking Name header', () => {
    render(<LegendDrawer series={mockSeries} />)

    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader)

    const labels = screen.getAllByText(/Metric$/)
    const names = labels.map((label) => label.textContent)

    expect(names).toEqual([CHARLIE_METRIC, BETA_METRIC, ALPHA_METRIC])
  })

  it('sorts by value when Value header is clicked (without checkboxes)', () => {
    render(
      <LegendDrawer
        series={mockSeriesWithValues}
        showCheckboxes={false}
        showValues
      />
    )

    const valueHeader = screen.getByText(VALUE_HEADER)
    fireEvent.click(valueHeader)

    const labels = screen.getAllByText(/Metric$/)
    const names = labels.map((label) => label.textContent)

    expect(names).toEqual([CHARLIE_METRIC, ALPHA_METRIC, BETA_METRIC])
  })

  it('sorts by value when Value header is clicked (with checkboxes)', () => {
    render(
      <LegendDrawer
        series={mockSeriesWithValues}
        showValues
      />
    )

    const valueHeader = screen.getByText(VALUE_HEADER)
    fireEvent.click(valueHeader)

    const labels = screen.getAllByText(/Metric$/)
    const names = labels.map((label) => label.textContent)

    expect(names).toEqual([CHARLIE_METRIC, ALPHA_METRIC, BETA_METRIC])
  })

  it('sorts by formatted value when no numeric value exists', () => {
    const clusterHeader = 'Cluster'
    const seriesWithFormattedValues: SeriesConfig[] = [
      {
        key: 'version-a',
        name: 'Version A',
        color: RED_HEX,
        type: SERIES_TYPES.AREA,
        formattedValue: 'Zulu Cluster'
      },
      {
        key: 'version-b',
        name: 'Version B',
        color: GREEN_HEX,
        type: SERIES_TYPES.AREA,
        formattedValue: 'Alpha Cluster'
      },
      {
        key: 'version-c',
        name: 'Version C',
        color: BLUE_HEX,
        type: SERIES_TYPES.AREA,
        formattedValue: 'Middle Cluster'
      }
    ]

    render(
      <LegendDrawer
        series={seriesWithFormattedValues}
        showCheckboxes={false}
        showValues
        valueHeaderLabel={clusterHeader}
      />
    )

    fireEvent.click(screen.getByText(clusterHeader))

    const labels = screen.getAllByText(/Version [ABC]/)
    const names = labels.map((label) => label.textContent)

    expect(names).toEqual(['Version B', 'Version C', 'Version A'])
  })
})

describe('LegendDrawer visibility toggle', () => {
  it('calls toggleMetric when clicking a legend item', () => {
    const toggleMetric = vi.fn()

    render(
      <LegendDrawer
        series={mockSeries}
        toggleMetric={toggleMetric}
      />
    )

    const alphaItem = screen.getByText(ALPHA_METRIC).closest('div')
    if (alphaItem) {
      fireEvent.click(alphaItem)
    }

    expect(toggleMetric).toHaveBeenCalledWith(METRIC_A_KEY)
  })

  it('calls onShowAll when select-all checkbox is clicked and some are hidden', () => {
    const onShowAll = vi.fn()
    const hiddenMetrics = new Set([METRIC_A_KEY])

    render(
      <LegendDrawer
        hiddenMetrics={hiddenMetrics}
        onShowAll={onShowAll}
        series={mockSeries}
      />
    )

    const checkboxes = screen.getAllByTestId(CHECKBOX_TEST_ID)
    fireEvent.click(checkboxes[0])

    expect(onShowAll).toHaveBeenCalled()
  })

  it('calls onHideAll when select-all checkbox is clicked and none are hidden', () => {
    const onHideAll = vi.fn()

    render(
      <LegendDrawer
        onHideAll={onHideAll}
        series={mockSeries}
      />
    )

    const checkboxes = screen.getAllByTestId(CHECKBOX_TEST_ID)
    fireEvent.click(checkboxes[0])

    expect(onHideAll).toHaveBeenCalled()
  })

  it('applies hidden style to hidden metrics', () => {
    const hiddenMetrics = new Set([METRIC_A_KEY])

    render(
      <LegendDrawer
        hiddenMetrics={hiddenMetrics}
        series={mockSeries}
      />
    )

    const alphaLabel = screen.getByText(ALPHA_METRIC)
    let parent = alphaLabel.parentElement
    while (parent && !parent.classList.contains('legendItem')) {
      parent = parent.parentElement
    }
    expect(parent?.className).toMatch(/hidden/)
  })
})

describe('LegendDrawer callbacks', () => {
  it('calls onVisibilityChange when drawer opens/closes', () => {
    const onVisibilityChange = vi.fn()

    const { rerender } = render(
      <LegendDrawer
        defaultOpen
        onVisibilityChange={onVisibilityChange}
        series={mockSeries}
      />
    )

    expect(onVisibilityChange).toHaveBeenCalledWith(true)

    rerender(
      <LegendDrawer
        defaultOpen={false}
        onVisibilityChange={onVisibilityChange}
        series={mockSeries}
      />
    )

    expect(onVisibilityChange).toHaveBeenCalledWith(false)
  })

  it('calls onWidthChange with width when open', () => {
    const onWidthChange = vi.fn()

    render(
      <LegendDrawer
        defaultOpen
        onWidthChange={onWidthChange}
        series={mockSeries}
      />
    )

    expect(onWidthChange).toHaveBeenCalledWith(expect.any(Number))
    expect(onWidthChange.mock.calls[0][0]).toBeGreaterThan(0)
  })

  it('calls onWidthChange with 0 when closed', () => {
    const onWidthChange = vi.fn()

    render(
      <LegendDrawer
        defaultOpen={false}
        onWidthChange={onWidthChange}
        series={mockSeries}
      />
    )

    expect(onWidthChange).toHaveBeenCalledWith(0)
  })
})

describe('LegendDrawer default props', () => {
  it('is open by default', () => {
    render(<LegendDrawer series={mockSeries} />)

    const drawer = document.querySelector(DRAWER_SELECTOR)
    expect(drawer?.className).toMatch(/open/)
  })

  it('respects defaultOpen=false', () => {
    render(
      <LegendDrawer
        defaultOpen={false}
        series={mockSeries}
      />
    )

    const drawer = document.querySelector(DRAWER_SELECTOR)
    expect(drawer?.className).not.toMatch(/open/)
  })

  it('respects custom defaultWidth when smaller than calculated', () => {
    const customWidth = 100

    render(
      <LegendDrawer
        defaultWidth={customWidth}
        series={mockSeries}
      />
    )

    const drawer = document.querySelector(DRAWER_SELECTOR) as HTMLElement
    expect(drawer?.style.width).toBe(`${customWidth}px`)
  })
})

describe('LegendDrawer multiselect mode', () => {
  it('does not call toggleMetric when multiselect is false', () => {
    const toggleMetric = vi.fn()

    render(
      <LegendDrawer
        multiselect={false}
        series={mockSeries}
        toggleMetric={toggleMetric}
      />
    )

    const alphaItem = screen.getByText(ALPHA_METRIC).closest('div')
    if (alphaItem) {
      fireEvent.click(alphaItem)
    }

    expect(toggleMetric).not.toHaveBeenCalled()
  })
})
