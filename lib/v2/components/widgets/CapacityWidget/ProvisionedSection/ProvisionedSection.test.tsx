import type { CapacityWidgetLabels } from '../types'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProvisionedSection } from './ProvisionedSection'

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

const ssd = { written: 943, provisioned: 1400 }
const obs = { written: 2500, provisioned: 3700 }

describe('ProvisionedSection', () => {
  it('renders both capsule labels when obs is present', () => {
    render(
      <ProvisionedSection
        labels={labels}
        obs={obs}
        ssd={ssd}
        total={5100}
        totalUnit='TB'
      />
    )

    expect(screen.getByText(labels.ssd)).toBeInTheDocument()
    expect(screen.getByText(labels.obs)).toBeInTheDocument()
  })

  it('renders per-tier written and provisioned with obs', () => {
    render(
      <ProvisionedSection
        labels={labels}
        obs={obs}
        ssd={ssd}
        total={5100}
        totalUnit='TB'
      />
    )

    expect(screen.getAllByText(labels.written)).toHaveLength(2)
    expect(screen.getAllByText(labels.provisioned)).toHaveLength(2)
    expect(screen.getByText(labels.totalProvisioned)).toBeInTheDocument()
  })

  it('omits the obs capsule and per-tier provisioned when obs is absent', () => {
    render(
      <ProvisionedSection
        labels={labels}
        ssd={ssd}
        total={1400}
        totalUnit='TB'
      />
    )

    expect(screen.queryByText(labels.obs)).not.toBeInTheDocument()
    expect(screen.getByText(labels.written)).toBeInTheDocument()
    expect(screen.getByText(labels.totalProvisioned)).toBeInTheDocument()
    expect(screen.queryByText(labels.provisioned)).not.toBeInTheDocument()
  })
})
