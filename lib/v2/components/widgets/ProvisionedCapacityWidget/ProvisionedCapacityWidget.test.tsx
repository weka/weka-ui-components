import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProvisionedCapacityWidget } from './ProvisionedCapacityWidget'

const createProps = (
  overrides: Partial<{
    used: number
    free: number
    total: number
    usedPercentage: number
    unit: string
    usedDisplay: string
    freeDisplay: string
    totalDisplay: string
  }> = {}
) => ({
  data: {
    used: 50,
    free: 50,
    total: 100,
    usedPercentage: 50,
    ...overrides
  }
})

const getProgressFill = (container: HTMLElement) =>
  container.querySelector('[class*="progressFill"]') as HTMLElement

describe('ProvisionedCapacityWidget', () => {
  describe('Rendering', () => {
    it('renders the container', () => {
      const { container } = render(
        <ProvisionedCapacityWidget {...createProps()} />
      )

      expect((container.firstChild as HTMLElement).className).toContain(
        'container'
      )
    })

    it('displays "Written" label', () => {
      render(<ProvisionedCapacityWidget {...createProps()} />)

      expect(screen.getAllByText('Written')).toHaveLength(2)
    })

    it('displays "Provisioned" label', () => {
      render(<ProvisionedCapacityWidget {...createProps()} />)

      expect(screen.getByText('Provisioned')).toBeInTheDocument()
    })

    it('uses provided label overrides', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps()}
          labels={{ written: 'Scritto', provisioned: 'Assegnato' }}
        />
      )

      expect(screen.getAllByText('Scritto')).toHaveLength(2)
      expect(screen.getByText('Assegnato')).toBeInTheDocument()
      expect(screen.queryByText('Written')).not.toBeInTheDocument()
    })
  })

  describe('Percentage Display', () => {
    it('displays percentage with one decimal place', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ usedPercentage: 33.333 })}
        />
      )

      expect(screen.getByText('33.3%')).toBeInTheDocument()
    })

    it('displays 100% without decimals when percentage is exactly 100', () => {
      render(
        <ProvisionedCapacityWidget {...createProps({ usedPercentage: 100 })} />
      )

      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('displays 0.0% for zero percentage', () => {
      render(
        <ProvisionedCapacityWidget {...createProps({ usedPercentage: 0 })} />
      )

      expect(screen.getByText('0.0%')).toBeInTheDocument()
    })
  })

  describe('Progress Bar', () => {
    it('sets progress fill height based on percentage', () => {
      const { container } = render(
        <ProvisionedCapacityWidget {...createProps({ usedPercentage: 75 })} />
      )

      const fill = getProgressFill(container)
      expect(fill).toHaveStyle({ height: '75%' })
    })

    it('handles zero percentage', () => {
      const { container } = render(
        <ProvisionedCapacityWidget {...createProps({ usedPercentage: 0 })} />
      )

      const fill = getProgressFill(container)
      expect(fill).toHaveStyle({ height: '0%' })
    })

    it('handles 100% percentage', () => {
      const { container } = render(
        <ProvisionedCapacityWidget {...createProps({ usedPercentage: 100 })} />
      )

      const fill = getProgressFill(container)
      expect(fill).toHaveStyle({ height: '100%' })
    })
  })

  describe('Value Formatting', () => {
    it('displays values with default TB unit', () => {
      render(
        <ProvisionedCapacityWidget {...createProps({ used: 50, total: 100 })} />
      )

      expect(screen.getAllByText('TB')).toHaveLength(2)
    })

    it('uses custom unit when provided', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ used: 500, total: 1000, unit: 'GB' })}
        />
      )

      expect(screen.getAllByText('GB')[0]).toBeInTheDocument()
    })

    it('uses usedDisplay value when provided', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ used: 50, usedDisplay: '50 PB' })}
        />
      )

      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('PB')).toBeInTheDocument()
    })

    it('uses totalDisplay value when provided', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ total: 100, totalDisplay: '100 PB' })}
        />
      )

      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('formats zero values correctly', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ used: 0, total: 0, usedPercentage: 0 })}
        />
      )

      expect(screen.getAllByText('0')[0]).toBeInTheDocument()
    })

    it('formats large values without decimals', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ used: 150, total: 300 })}
        />
      )

      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('300')).toBeInTheDocument()
    })

    it('formats medium values with one decimal', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ used: 15.5, total: 30.5 })}
        />
      )

      expect(screen.getByText('15.5')).toBeInTheDocument()
      expect(screen.getByText('30.5')).toBeInTheDocument()
    })

    it('formats small values with two decimals', () => {
      render(
        <ProvisionedCapacityWidget
          {...createProps({ used: 1.55, total: 5.55 })}
        />
      )

      expect(screen.getByText('1.55')).toBeInTheDocument()
      expect(screen.getByText('5.55')).toBeInTheDocument()
    })
  })
})
