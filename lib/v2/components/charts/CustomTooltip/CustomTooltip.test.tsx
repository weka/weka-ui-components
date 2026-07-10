import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import {
  SERIES_TYPES,
  type SeriesConfig,
  type TooltipPayloadItem
} from '../chartTypes'
import { CustomTooltip } from './CustomTooltip'

const TOOLTIP_TEST_ID = 'chart-tooltip'
const TIMESTAMP_MS = 1704067200000
const READ_COLOR = 'var(--blue-500)'
const WRITE_COLOR = 'var(--aqua-500)'

const SERIES: SeriesConfig[] = [
  { key: 'read', name: 'Read', color: READ_COLOR, type: SERIES_TYPES.LINE },
  { key: 'write', name: 'Write', color: WRITE_COLOR, type: SERIES_TYPES.LINE },
  {
    key: 'total',
    name: 'Total',
    color: 'var(--purple-500)',
    type: SERIES_TYPES.LINE
  }
]

const PAYLOAD: TooltipPayloadItem[] = [
  { dataKey: 'read', name: 'read', value: 120, color: READ_COLOR },
  { dataKey: 'write', name: 'write', value: 45, color: WRITE_COLOR }
]

describe('CustomTooltip', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(
      <CustomTooltip
        active={false}
        label='10:00'
        payload={PAYLOAD}
        series={SERIES}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the payload is empty', () => {
    const { container } = render(
      <CustomTooltip
        active
        label='10:00'
        payload={[]}
        series={SERIES}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a timestamp header with date and 24-hour time matching the axis format', () => {
    render(
      <CustomTooltip
        active
        label={String(TIMESTAMP_MS)}
        series={SERIES}
        payload={[
          { ...PAYLOAD[0], payload: { timestamp: TIMESTAMP_MS } },
          PAYLOAD[1]
        ]}
      />
    )

    const tooltipText = screen.getByTestId(TOOLTIP_TEST_ID).textContent
    expect(tooltipText).toMatch(/(\d{2}\s\w{3}|\w{3}\s\d{2})/)
    expect(tooltipText).toMatch(/\d{2}:\d{2}/)
    expect(tooltipText).not.toMatch(/am|pm/i)
    expect(tooltipText).not.toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  it('renders series names, dot colors and values', () => {
    render(
      <CustomTooltip
        active
        label='10:00'
        payload={PAYLOAD}
        series={SERIES}
      />
    )

    expect(screen.getByText('Read')).toBeInTheDocument()
    expect(screen.getByText('Write')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()

    const tooltip = screen.getByTestId(TOOLTIP_TEST_ID)
    const [readDot] = tooltip.getElementsByClassName('tooltipDot')
    expect(readDot).toHaveAttribute(
      'style',
      expect.stringContaining(READ_COLOR)
    )
  })

  it('prefers formattedValue over valueFormatter', () => {
    render(
      <CustomTooltip
        active
        label='10:00'
        payload={[{ ...PAYLOAD[0], formattedValue: '1.2 GB/s' }, PAYLOAD[1]]}
        series={SERIES}
        valueFormatter={(value) => `${value} IOPS`}
      />
    )

    expect(screen.getByText('1.2 GB/s')).toBeInTheDocument()
    expect(screen.queryByText('120 IOPS')).not.toBeInTheDocument()
    expect(screen.getByText('45 IOPS')).toBeInTheDocument()
  })

  it('sorts values descending with the total key first', () => {
    render(
      <CustomTooltip
        active
        label='10:00'
        series={SERIES}
        sortValuesDescending
        payload={[
          ...PAYLOAD,
          {
            dataKey: 'total',
            name: 'total',
            value: 165,
            color: 'var(--purple-500)'
          }
        ]}
      />
    )

    const text = screen.getByTestId(TOOLTIP_TEST_ID).textContent ?? EMPTY_STRING
    expect(text.indexOf('TOTAL')).toBeLessThan(text.indexOf('Read'))
    expect(text.indexOf('Read')).toBeLessThan(text.indexOf('Write'))
  })

  it('applies the left alignment class when valueAlignment is left', () => {
    render(
      <CustomTooltip
        active
        label='10:00'
        payload={PAYLOAD}
        series={SERIES}
        valueAlignment='left'
      />
    )

    expect(screen.getByText('120')).toHaveClass('leftAligned')
  })

  it('renders parsed additional info as label/value rows', () => {
    const getAdditionalTooltipInfo = vi.fn(() => ['Host: wekahost-01'])

    render(
      <CustomTooltip
        active
        getAdditionalTooltipInfo={getAdditionalTooltipInfo}
        label='10:00'
        payload={PAYLOAD}
        series={SERIES}
      />
    )

    expect(screen.getByText('Host')).toBeInTheDocument()
    expect(screen.getByText('wekahost-01')).toBeInTheDocument()
  })
})
