import { cloneElement, type ReactElement } from 'react'
import { render } from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi
} from 'vitest'

import { NOP } from '#consts'

import { BaseBarChart } from './BaseBarChart'
import { BaseComposedChart } from './BaseComposedChart'
import { BaseLineChart } from './BaseLineChart'
import { BasePieChart } from './BasePieChart'
import { BAR_CHART_ORIENTATIONS, SERIES_TYPES } from './chartTypes'
import { DonutChart } from './DonutChart'
import { MiniChart } from './MiniChart'

type Sized = ReactElement<{ width: number; height: number }>
const { sized } = vi.hoisted(() => {
  const chartSize = { width: 600, height: 300 }
  return {
    sized: ({ children }: Readonly<{ children: Sized }>) =>
      cloneElement(children, chartSize)
  }
})

vi.mock('./StableChartContainer', () => ({ StableChartContainer: sized }))
vi.mock('recharts', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ResponsiveContainer: sized
}))

const DATA = [
  { timestamp: 1, name: 'a', value: 10, used: 10 },
  { timestamp: 2, name: 'b', value: 20, used: 20 }
]

describe('charts render with real recharts', () => {
  let consoleError: MockInstance
  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(NOP)
  })
  afterEach(() => {
    consoleError.mockRestore()
  })

  const cases: [string, () => ReactElement][] = [
    [
      'BaseBarChart',
      () => (
        <BaseBarChart
          data={DATA}
          dataKey='value'
          xAxisKey='name'
        />
      )
    ],
    [
      'BaseBarChart clickable',
      () => (
        <BaseBarChart
          data={DATA}
          dataKey='value'
          onBarClick={NOP}
          xAxisKey='name'
        />
      )
    ],
    [
      'BaseBarChart horizontal',
      () => (
        <BaseBarChart
          data={DATA}
          dataKey='value'
          orientation={BAR_CHART_ORIENTATIONS.HORIZONTAL}
          xAxisKey='name'
        />
      )
    ],
    [
      'BaseComposedChart',
      () => (
        <BaseComposedChart
          data={DATA}
          series={[
            { key: 'used', name: 'Used', color: '#000', type: SERIES_TYPES.BAR }
          ]}
        />
      )
    ],
    [
      'BaseLineChart',
      () => (
        <BaseLineChart
          data={DATA}
          series={[
            {
              key: 'used',
              name: 'Used',
              color: '#000',
              type: SERIES_TYPES.LINE
            }
          ]}
        />
      )
    ],
    ['BasePieChart', () => <BasePieChart data={DATA} />],
    [
      'DonutChart',
      () => <DonutChart segments={[{ name: 'a', value: 1, color: '#000' }]} />
    ],
    [
      'MiniChart',
      () => (
        <MiniChart
          color='#000'
          data={[
            { time: '2026-01-01T00:00:00Z', value: 1 },
            { time: '2026-01-01T00:01:00Z', value: 2 }
          ]}
        />
      )
    ]
  ]

  it.each(cases)('%s', (_name, make) => {
    render(make())
    expect(consoleError.mock.calls.map(([message]) => String(message))).toEqual(
      []
    )
  })
})
