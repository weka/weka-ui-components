import type { CapacityWidgetLabels } from '../types'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UsableSection } from './UsableSection'

vi.mock('recharts', () => ({
  Cell: () => null,
  Pie: () => null,
  PieChart: () => null,
  ResponsiveContainer: () => null
}))

const labels: CapacityWidgetLabels = {
  used: 'Used',
  free: 'Free',
  totalUsable: 'Total Usable',
  dataReduction: 'Data Reduction',
  saving: 'Saving',
  written: 'Written',
  provisioned: 'Provisioned',
  totalProvisioned: 'Total Provisioned',
  ssd: 'SSD',
  obs: 'OBS'
}

describe('UsableSection', () => {
  it('renders the used, free and total usable labels', () => {
    render(
      <UsableSection
        data={{ used: 406.5, free: 312.2, total: 718.7, unit: 'TB' }}
        labels={labels}
      />
    )

    expect(screen.getByText(labels.used)).toBeInTheDocument()
    expect(screen.getByText(labels.free)).toBeInTheDocument()
    expect(screen.getByText(labels.totalUsable)).toBeInTheDocument()
  })

  it('renders the used percentage', () => {
    render(
      <UsableSection
        data={{ used: 50, free: 50, total: 100 }}
        labels={labels}
      />
    )

    expect(screen.getByText('50.0%')).toBeInTheDocument()
  })

  it('renders data reduction when provided', () => {
    render(
      <UsableSection
        labels={labels}
        data={{
          used: 1,
          free: 1,
          total: 2,
          dataReduction: { ratio: '2:1', savings: '50 TB' }
        }}
      />
    )

    expect(screen.getByText(labels.dataReduction)).toBeInTheDocument()
    expect(screen.getByText('2:1')).toBeInTheDocument()
  })

  it('omits data reduction when absent', () => {
    render(
      <UsableSection
        data={{ used: 1, free: 1, total: 2 }}
        labels={labels}
      />
    )

    expect(screen.queryByText(labels.dataReduction)).not.toBeInTheDocument()
  })
})
