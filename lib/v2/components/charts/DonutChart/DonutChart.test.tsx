import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DonutChart } from './DonutChart'

vi.mock('recharts', () => ({
  Cell: () => null,
  Pie: ({ children }: { children?: unknown }) => children ?? null,
  PieChart: ({ children }: { children?: unknown }) => children ?? null,
  ResponsiveContainer: ({ children }: { children?: unknown }) => children ?? null
}))

describe('DonutChart', () => {
  it('renders without crashing for the given segments', () => {
    const { container } = render(
      <DonutChart
        segments={[
          { name: 'Used', value: 60, color: 'var(--fuchsia-400-600)' },
          { name: 'Free', value: 40, color: 'var(--gray-300-700)' }
        ]}
      />
    )

    expect(container).toBeInTheDocument()
  })
})
