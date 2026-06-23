import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { type CapacityData, CapacityWidget } from './CapacityWidget'

vi.mock('recharts', () => ({
  Cell: () => null,
  Pie: () => null,
  PieChart: () => null,
  ResponsiveContainer: () => null
}))

const MIN_DISPLAY_VALUE_MATCHES = 3

const createProps = (
  dataOverrides: Partial<CapacityData> = {},
  showProvisioned = false
) => ({
  data: {
    used: 50,
    free: 50,
    total: 100,
    ...dataOverrides
  },
  showProvisioned
})

describe('CapacityWidget', () => {
  describe('Rendering', () => {
    it('renders the container', () => {
      const { container } = render(<CapacityWidget {...createProps()} />)

      expect((container.firstChild as HTMLElement).className).toContain(
        'container'
      )
    })

    it('displays Used label', () => {
      render(<CapacityWidget {...createProps()} />)

      expect(screen.getByText('Used')).toBeInTheDocument()
    })

    it('displays Free label', () => {
      render(<CapacityWidget {...createProps()} />)

      expect(screen.getByText('Free')).toBeInTheDocument()
    })

    it('displays Total Usable label', () => {
      render(<CapacityWidget {...createProps()} />)

      expect(screen.getByText('Total Usable')).toBeInTheDocument()
    })

    it('uses provided label overrides', () => {
      render(
        <CapacityWidget
          {...createProps()}
          labels={{ used: 'Consumed', free: 'Available' }}
        />
      )

      expect(screen.getByText('Consumed')).toBeInTheDocument()
      expect(screen.getByText('Available')).toBeInTheDocument()
      expect(screen.queryByText('Used')).not.toBeInTheDocument()
    })
  })

  describe('Percentage Display', () => {
    it('displays percentage with one decimal place', () => {
      render(<CapacityWidget {...createProps({ used: 33.333, total: 100 })} />)

      expect(screen.getByText('33.3%')).toBeInTheDocument()
    })

    it('displays 100% without decimals when percentage is exactly 100', () => {
      render(<CapacityWidget {...createProps({ used: 100, total: 100 })} />)

      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('displays 0.0% for zero usage', () => {
      render(<CapacityWidget {...createProps({ used: 0, total: 100 })} />)

      expect(screen.getByText('0.0%')).toBeInTheDocument()
    })

    it('handles zero total gracefully', () => {
      render(<CapacityWidget {...createProps({ used: 0, total: 0 })} />)

      expect(screen.getByText('0.0%')).toBeInTheDocument()
    })
  })

  describe('Value Formatting', () => {
    it('uses display values when provided', () => {
      render(
        <CapacityWidget
          {...createProps({
            usedDisplay: '50 PB',
            freeDisplay: '50 PB',
            totalDisplay: '100 PB'
          })}
        />
      )

      expect(screen.getAllByText('100')).toHaveLength(1)
      expect(screen.getAllByText('PB').length).toBeGreaterThanOrEqual(
        MIN_DISPLAY_VALUE_MATCHES
      )
    })

    it('formats values with TB unit by default', () => {
      render(
        <CapacityWidget {...createProps({ used: 50, free: 50, total: 100 })} />
      )

      const tbElements = screen.getAllByText('TB')
      expect(tbElements.length).toBeGreaterThan(0)
    })

    it('uses GB unit when specified', () => {
      render(<CapacityWidget {...createProps({ unit: 'GB', used: 500 })} />)

      const gbElements = screen.getAllByText('GB')
      expect(gbElements.length).toBeGreaterThan(0)
    })

    it('formats small values (< 1) with 3 decimal places', () => {
      render(<CapacityWidget {...createProps({ used: 0.123, total: 1 })} />)

      expect(screen.getAllByText('0.123')).toHaveLength(2)
    })

    it('formats medium values (1-10) with 2 decimal places', () => {
      render(<CapacityWidget {...createProps({ used: 5.55, total: 10 })} />)

      expect(screen.getAllByText('5.55')).toHaveLength(2)
    })

    it('formats large values (>= 10) with 1 decimal place', () => {
      render(<CapacityWidget {...createProps({ used: 55.5, total: 100 })} />)

      expect(screen.getAllByText('55.5')).toHaveLength(2)
    })

    it('formats GB values < 10 with 1 decimal place', () => {
      render(<CapacityWidget {...createProps({ unit: 'GB', used: 5.5 })} />)

      expect(screen.getAllByText('5.5')).toHaveLength(2)
    })

    it('formats GB values >= 10 without decimal places', () => {
      render(<CapacityWidget {...createProps({ unit: 'GB', used: 55 })} />)

      expect(screen.getAllByText('55')).toHaveLength(2)
    })
  })

  describe('Provisioned Capacity', () => {
    it('displays Provisioned label when showProvisioned is true and provisioned value exists', () => {
      render(<CapacityWidget {...createProps({ provisioned: 200 }, true)} />)

      expect(screen.getByText('Provisioned')).toBeInTheDocument()
    })

    it('does not display Provisioned when showProvisioned is false', () => {
      render(<CapacityWidget {...createProps({ provisioned: 200 }, false)} />)

      expect(screen.queryByText('Provisioned')).not.toBeInTheDocument()
    })

    it('does not display Provisioned when provisioned value is not provided', () => {
      render(
        <CapacityWidget {...createProps({ provisioned: undefined }, true)} />
      )

      expect(screen.queryByText('Provisioned')).not.toBeInTheDocument()
    })
  })

  describe('Data Reduction', () => {
    it('displays Data Reduction section when data reduction info is provided', () => {
      render(
        <CapacityWidget
          {...createProps({
            dataReduction: { ratio: '2:1', savings: '50 TB' }
          })}
        />
      )

      expect(screen.getAllByText(/Data Reduction:/)).toHaveLength(2)
    })

    it('displays data reduction ratio', () => {
      render(
        <CapacityWidget
          {...createProps({
            dataReduction: { ratio: '3:1', savings: '100 TB' }
          })}
        />
      )

      expect(screen.getAllByText('3:1')).toHaveLength(2)
    })

    it('displays savings value and unit', () => {
      render(
        <CapacityWidget
          {...createProps({
            dataReduction: { ratio: '2:1', savings: '75 GB' }
          })}
        />
      )

      expect(screen.getAllByText('75')).toHaveLength(2)
      expect(screen.getAllByText('GB')).toHaveLength(2)
    })

    it('does not display Data Reduction section when not provided', () => {
      render(<CapacityWidget {...createProps({ dataReduction: undefined })} />)

      expect(screen.queryByText('Data Reduction:')).not.toBeInTheDocument()
    })

    it('handles savings without unit', () => {
      render(
        <CapacityWidget
          {...createProps({
            dataReduction: { ratio: '2:1', savings: '50' }
          })}
        />
      )

      expect(screen.getAllByText('50')).toHaveLength(2)
    })

    it('handles empty savings string', () => {
      render(
        <CapacityWidget
          {...createProps({
            dataReduction: { ratio: '2:1', savings: EMPTY_STRING }
          })}
        />
      )

      expect(screen.getAllByText('2:1')).toHaveLength(2)
    })
  })

  describe('Layout', () => {
    it('applies noDataReductionLayout class when no data reduction', () => {
      const { container } = render(
        <CapacityWidget {...createProps({ dataReduction: undefined })} />
      )

      const topSection = container.querySelector('[class*="topSection"]')
      expect(topSection?.className).toContain('noDataReductionLayout')
    })

    it('does not apply noDataReductionLayout class when data reduction exists', () => {
      const { container } = render(
        <CapacityWidget
          {...createProps({
            dataReduction: { ratio: '2:1', savings: '50 TB' }
          })}
        />
      )

      const topSection = container.querySelector('[class*="topSection"]')
      expect(topSection?.className).not.toContain('noDataReductionLayout')
    })
  })
})
