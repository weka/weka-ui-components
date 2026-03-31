import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CapacityProgressBar } from './CapacityProgressBar'

const getProgressBar = (container: HTMLElement) =>
  container.firstChild as HTMLElement

const getProgressFill = (container: HTMLElement) =>
  container.querySelector('[class*="progressFill"]') as HTMLElement

describe('CapacityProgressBar', () => {
  describe('Rendering', () => {
    it('renders progress bar container', () => {
      const { container } = render(<CapacityProgressBar percentage={50} />)

      const progressBar = getProgressBar(container)
      expect(progressBar.className).toContain('progressBar')
    })

    it('renders progress fill element', () => {
      const { container } = render(<CapacityProgressBar percentage={50} />)

      const fill = getProgressFill(container)
      expect(fill).toBeInTheDocument()
    })

    it('does not show percentage text by default', () => {
      render(<CapacityProgressBar percentage={50} />)

      expect(screen.queryByText('50.0%')).not.toBeInTheDocument()
    })

    it('shows percentage text when showPercentageText is true', () => {
      render(
        <CapacityProgressBar
          percentage={50}
          showPercentageText
        />
      )

      expect(screen.getByText('50.0%')).toBeInTheDocument()
    })

    it('shows 100% without decimals when percentage is exactly 100', () => {
      render(
        <CapacityProgressBar
          percentage={100}
          showPercentageText
        />
      )

      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  describe('Fill Width', () => {
    it('sets fill width based on percentage', () => {
      const { container } = render(<CapacityProgressBar percentage={75} />)

      const fill = getProgressFill(container)
      expect(fill).toHaveStyle({ width: '75%' })
    })

    it('clamps fill width at 100% for percentages over 100', () => {
      const { container } = render(<CapacityProgressBar percentage={150} />)

      const fill = getProgressFill(container)
      expect(fill).toHaveStyle({ width: '100%' })
    })

    it('handles zero percentage', () => {
      const { container } = render(<CapacityProgressBar percentage={0} />)

      const fill = getProgressFill(container)
      expect(fill).toHaveStyle({ width: '0%' })
    })
  })

  describe('Color Thresholds', () => {
    it('uses cyan color for percentage <= 75%', () => {
      const { container } = render(<CapacityProgressBar percentage={75} />)

      const fill = getProgressFill(container)
      expect(fill.className).toContain('fillCyan')
    })

    it('uses cyan color for low percentages', () => {
      const { container } = render(<CapacityProgressBar percentage={25} />)

      const fill = getProgressFill(container)
      expect(fill.className).toContain('fillCyan')
    })

    it('uses orange color for percentage > 75% and <= 95%', () => {
      const { container } = render(<CapacityProgressBar percentage={76} />)

      const fill = getProgressFill(container)
      expect(fill.className).toContain('fillOrange')
    })

    it('uses orange color at 95%', () => {
      const { container } = render(<CapacityProgressBar percentage={95} />)

      const fill = getProgressFill(container)
      expect(fill.className).toContain('fillOrange')
    })

    it('uses red color for percentage > 95%', () => {
      const { container } = render(<CapacityProgressBar percentage={96} />)

      const fill = getProgressFill(container)
      expect(fill.className).toContain('fillRed')
    })

    it('uses red color for 100%', () => {
      const { container } = render(<CapacityProgressBar percentage={100} />)

      const fill = getProgressFill(container)
      expect(fill.className).toContain('fillRed')
    })
  })

  describe('Customization', () => {
    it('applies default height of 24px', () => {
      const { container } = render(<CapacityProgressBar percentage={50} />)

      const progressBar = getProgressBar(container)
      expect(progressBar).toHaveStyle({ height: '24px' })
    })

    it('applies custom height', () => {
      const { container } = render(
        <CapacityProgressBar
          height={16}
          percentage={50}
        />
      )

      const progressBar = getProgressBar(container)
      expect(progressBar).toHaveStyle({ height: '16px' })
    })

    it('applies default borderRadius of 20px', () => {
      const { container } = render(<CapacityProgressBar percentage={50} />)

      const progressBar = getProgressBar(container)
      expect(progressBar).toHaveStyle({ borderRadius: '20px' })
    })

    it('applies custom borderRadius', () => {
      const { container } = render(
        <CapacityProgressBar
          borderRadius={8}
          percentage={50}
        />
      )

      const progressBar = getProgressBar(container)
      expect(progressBar).toHaveStyle({ borderRadius: '8px' })
    })

    it('applies extraClass when provided', () => {
      const { container } = render(
        <CapacityProgressBar
          extraClass='custom-class'
          percentage={50}
        />
      )

      const progressBar = getProgressBar(container)
      expect(progressBar.className).toContain('custom-class')
    })

    it('applies left-side borderRadius to fill', () => {
      const { container } = render(
        <CapacityProgressBar
          borderRadius={12}
          percentage={50}
        />
      )

      const fill = getProgressFill(container)
      expect(fill).toHaveStyle({ borderRadius: '12px 0 0 12px' })
    })
  })

  describe('Percentage Text Formatting', () => {
    it('formats percentage with one decimal place', () => {
      render(
        <CapacityProgressBar
          percentage={33.333}
          showPercentageText
        />
      )

      expect(screen.getByText('33.3%')).toBeInTheDocument()
    })

    it('shows .0 for whole numbers', () => {
      render(
        <CapacityProgressBar
          percentage={50}
          showPercentageText
        />
      )

      expect(screen.getByText('50.0%')).toBeInTheDocument()
    })

    it('displays original percentage in text even when over 100', () => {
      render(
        <CapacityProgressBar
          percentage={150}
          showPercentageText
        />
      )

      expect(screen.getByText('150.0%')).toBeInTheDocument()
    })
  })
})
