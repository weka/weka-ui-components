import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { EmptyChartState } from './EmptyChartState'

vi.mock('../../icons', () => ({
  ChartIcon: ({
    color,
    extraClass
  }: {
    color?: string
    extraClass?: string
  }) => (
    <svg data-testid='chart-icon' data-color={color} className={extraClass} />
  )
}))

describe('EmptyChartState', () => {
  describe('Rendering', () => {
    it('renders with default message', () => {
      render(<EmptyChartState />)

      expect(screen.getByText('No Current Data')).toBeInTheDocument()
    })

    it('renders with custom message', () => {
      render(<EmptyChartState message='No data available' />)

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('renders chart icon', () => {
      render(<EmptyChartState />)

      expect(screen.getByTestId('chart-icon')).toBeInTheDocument()
    })

    it('passes correct color to chart icon', () => {
      render(<EmptyChartState />)

      const icon = screen.getByTestId('chart-icon')
      expect(icon).toHaveAttribute('data-color', 'var(--gray-900-100)')
    })
  })

  describe('Height Customization', () => {
    it('applies default height of 270px', () => {
      const { container } = render(<EmptyChartState />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveStyle({ height: '270px' })
    })

    it('applies custom numeric height with px suffix', () => {
      const { container } = render(<EmptyChartState height={200} />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveStyle({ height: '200px' })
    })

    it('applies custom string height directly', () => {
      const { container } = render(<EmptyChartState height='100%' />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveStyle({ height: '100%' })
    })

    it('applies auto height', () => {
      const { container } = render(<EmptyChartState height='auto' />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveStyle({ height: 'auto' })
    })
  })

  describe('Styling', () => {
    it('applies emptyState class to container', () => {
      const { container } = render(<EmptyChartState />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('emptyState')
    })

    it('renders content wrapper', () => {
      const { container } = render(<EmptyChartState />)

      const content = container.querySelector('[class*="content"]')
      expect(content).toBeInTheDocument()
    })

    it('renders message in paragraph element', () => {
      render(<EmptyChartState message='Test message' />)

      const message = screen.getByText('Test message')
      expect(message.tagName).toBe('P')
    })
  })
})
