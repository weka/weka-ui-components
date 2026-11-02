import { cloneElement, type ReactElement } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SERIES_TYPES, type SeriesConfig } from '../chartTypes'
import { BaseComposedChart } from './BaseComposedChart'

vi.mock('../StableChartContainer', () => ({
  StableChartContainer: ({
    children
  }: Readonly<{ children: ReactElement<{ width: number; height: number }> }>) =>
    cloneElement(children, { width: 600, height: 300 })
}))

const DATA = [
  { timestamp: 1, used: 10, forecast: 12 },
  { timestamp: 2, used: 20, forecast: 22 }
]

describe('BaseComposedChart with real recharts', () => {
  it.each([SERIES_TYPES.AREA, SERIES_TYPES.BAR, SERIES_TYPES.LINE])(
    'renders a %s series on the primary axis without throwing',
    (type) => {
      const series: SeriesConfig[] = [
        { key: 'used', name: 'Used', color: '#000', type }
      ]

      expect(() =>
        render(
          <BaseComposedChart
            data={DATA}
            series={series}
          />
        )
      ).not.toThrow()
    }
  )
})
