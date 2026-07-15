import type {
  CapacityProvisionedData,
  CapacityUsableData
} from './CapacityWidget'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CapacityWidget } from './CapacityWidget'

vi.mock('recharts', () => ({
  Cell: () => null,
  Pie: () => null,
  PieChart: () => null,
  ResponsiveContainer: () => null
}))

const usable: CapacityUsableData = {
  used: 406.5,
  free: 312.2,
  total: 718.7,
  unit: 'TB',
  dataReduction: { ratio: '2.32:1', savings: '536.4 TB' }
}

const provisionedWithObs: CapacityProvisionedData = {
  ssd: {
    written: 943,
    provisioned: 1400,
    writtenDisplay: '943 TB',
    provisionedDisplay: '1.4 PB'
  },
  obs: {
    written: 2500,
    provisioned: 3700,
    writtenDisplay: '2.5 PB',
    provisionedDisplay: '3.7 PB'
  },
  total: 5100,
  totalDisplay: '5.1 PB',
  unit: 'TB'
}

const provisionedSsdOnly: CapacityProvisionedData = {
  ssd: { written: 943, provisioned: 1400 },
  total: 1400
}

const renderWidget = (
  overrides: Partial<{
    usable: CapacityUsableData
    provisioned: CapacityProvisionedData
    labels: Parameters<typeof CapacityWidget>[0]['labels']
  }> = {}
) =>
  render(
    <CapacityWidget
      labels={overrides.labels}
      provisioned={overrides.provisioned ?? provisionedWithObs}
      usable={overrides.usable ?? usable}
    />
  )

describe('CapacityWidget', () => {
  describe('Usable section', () => {
    it('renders the used, free and total usable labels', () => {
      renderWidget()

      expect(screen.getByText('Used')).toBeInTheDocument()
      expect(screen.getByText('Free')).toBeInTheDocument()
      expect(screen.getByText('Total Usable')).toBeInTheDocument()
    })

    it('renders the used percentage with one decimal', () => {
      renderWidget({
        usable: { ...usable, used: 33.333, free: 66.667, total: 100 }
      })

      expect(screen.getByText('33.3%')).toBeInTheDocument()
    })

    it('renders 100% without decimals when full', () => {
      renderWidget({
        usable: { ...usable, used: 100, free: 0, total: 100 }
      })

      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('renders 0.0% when total is zero', () => {
      renderWidget({
        usable: { ...usable, used: 0, free: 0, total: 0 }
      })

      expect(screen.getByText('0.0%')).toBeInTheDocument()
    })

    it('uses display values verbatim', () => {
      renderWidget({
        usable: {
          used: 406.5,
          free: 312.2,
          total: 718.7,
          usedDisplay: '406.5 TB',
          totalDisplay: '718.7 TB'
        }
      })

      expect(screen.getAllByText('718.7').length).toBeGreaterThan(0)
    })
  })

  describe('Data reduction', () => {
    it('renders the ratio and savings when provided', () => {
      renderWidget()

      expect(screen.getByText('Data Reduction')).toBeInTheDocument()
      expect(screen.getByText('2.32:1')).toBeInTheDocument()
      expect(screen.getByText(/Saving 536.4/)).toBeInTheDocument()
    })

    it('is omitted when not provided', () => {
      renderWidget({ usable: { ...usable, dataReduction: undefined } })

      expect(screen.queryByText('Data Reduction')).not.toBeInTheDocument()
    })

    it('does not append the capacity unit to a unitless savings value', () => {
      renderWidget({
        usable: {
          ...usable,
          unit: 'PB',
          dataReduction: { ratio: '2:1', savings: '50' }
        }
      })

      expect(screen.getByText(/Saving 50/)).toHaveTextContent(
        /\(Saving 50\s*\)/
      )
    })
  })

  describe('Provisioned section', () => {
    it('renders the SSD capsule label', () => {
      renderWidget()

      expect(screen.getByText('SSD')).toBeInTheDocument()
    })

    it('renders the OBS capsule label when obs data is provided', () => {
      renderWidget()

      expect(screen.getByText('OBS')).toBeInTheDocument()
    })

    it('renders written and provisioned per tier when obs is present', () => {
      renderWidget()

      expect(screen.getAllByText('Written')).toHaveLength(2)
      expect(screen.getAllByText('Provisioned')).toHaveLength(2)
    })

    it('renders the total provisioned pill when obs is present', () => {
      renderWidget()

      expect(screen.getByText('Total Provisioned')).toBeInTheDocument()
      expect(screen.getByText('5.1')).toBeInTheDocument()
    })

    it('omits the OBS capsule when obs data is absent', () => {
      renderWidget({ provisioned: provisionedSsdOnly })

      expect(screen.queryByText('OBS')).not.toBeInTheDocument()
    })

    it('shows total provisioned inline when obs is absent', () => {
      renderWidget({ provisioned: provisionedSsdOnly })

      expect(screen.getByText('Written')).toBeInTheDocument()
      expect(screen.getByText('Total Provisioned')).toBeInTheDocument()
      expect(screen.queryByText('Provisioned')).not.toBeInTheDocument()
    })
  })

  describe('Capsule fill', () => {
    it('fills each capsule to the written / provisioned ratio', () => {
      const { container } = render(
        <CapacityWidget
          usable={usable}
          provisioned={{
            ssd: { written: 50, provisioned: 100 },
            obs: { written: 30, provisioned: 100 },
            total: 200
          }}
        />
      )

      const fills = container.querySelectorAll('[class*="capsuleFill"]')
      expect(fills[0]).toHaveStyle({ height: '50%' })
      expect(fills[1]).toHaveStyle({ height: '30%' })
    })

    it('clamps fill to 100% when written exceeds provisioned', () => {
      const { container } = render(
        <CapacityWidget
          provisioned={{ ssd: { written: 150, provisioned: 100 }, total: 100 }}
          usable={usable}
        />
      )

      const fill = container.querySelector('[class*="capsuleFill"]')
      expect(fill).toHaveStyle({ height: '100%' })
    })
  })

  describe('Labels', () => {
    it('applies label overrides', () => {
      renderWidget({ labels: { used: 'Consumed', ssd: 'Flash' } })

      expect(screen.getByText('Consumed')).toBeInTheDocument()
      expect(screen.getByText('Flash')).toBeInTheDocument()
      expect(screen.queryByText('Used')).not.toBeInTheDocument()
    })
  })
})
