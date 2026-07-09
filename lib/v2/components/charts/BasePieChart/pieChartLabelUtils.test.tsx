import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SERIES_TYPES, type SeriesConfig } from '../chartTypes'
import {
  createPieChartLabelRenderer,
  createPieChartTooltip,
  type PieChartPayloadItem
} from './pieChartLabelUtils'

const LABEL_GEOMETRY = {
  cx: 100,
  cy: 100,
  midAngle: 90,
  innerRadius: 60,
  outerRadius: 100
}

const SERIES: SeriesConfig[] = [
  {
    key: 'NFS',
    name: 'NFS',
    color: 'var(--blue-500)',
    type: SERIES_TYPES.BAR
  }
]

const PIE_PAYLOAD: PieChartPayloadItem[] = [
  {
    name: 'NFS',
    value: 60,
    payload: { name: 'NFS', value: 60, fill: 'var(--blue-500)' }
  }
]

describe('createPieChartLabelRenderer', () => {
  it('renders the slice percentage', () => {
    const renderLabel = createPieChartLabelRenderer()

    render(<svg>{renderLabel({ ...LABEL_GEOMETRY, percent: 0.42 })}</svg>)

    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('hides labels below the minimum percentage threshold', () => {
    const renderLabel = createPieChartLabelRenderer()

    expect(renderLabel({ ...LABEL_GEOMETRY, percent: 0.03 })).toBeNull()
  })

  it('respects a custom minimum percentage threshold', () => {
    const renderLabel = createPieChartLabelRenderer({
      minPercentageThreshold: 50
    })

    expect(renderLabel({ ...LABEL_GEOMETRY, percent: 0.42 })).toBeNull()
  })
})

describe('createPieChartTooltip', () => {
  it('renders the formatted payload through CustomTooltip', () => {
    const PieTooltip = createPieChartTooltip({
      series: SERIES,
      formatPayload: (payload) =>
        payload.map((item) => ({
          dataKey: item.name,
          name: item.name,
          value: item.value,
          color: item.payload.fill,
          formattedValue: `${item.value} shares`
        }))
    })

    render(
      <PieTooltip
        active
        payload={PIE_PAYLOAD}
      />
    )

    expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument()
    expect(screen.getByText('NFS')).toBeInTheDocument()
    expect(screen.getByText('60 shares')).toBeInTheDocument()
  })

  it('renders nothing when inactive', () => {
    const PieTooltip = createPieChartTooltip({
      series: SERIES,
      formatPayload: () => []
    })

    const { container } = render(
      <PieTooltip
        active={false}
        payload={PIE_PAYLOAD}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
