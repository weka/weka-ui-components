import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { GradientAlertIcon } from './GradientAlertIcon'

describe('GradientAlertIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<GradientAlertIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders with default size of 40', () => {
    const { container } = render(<GradientAlertIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('renders with custom size', () => {
    const { container } = render(<GradientAlertIcon size={24} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('renders gradient with correct ID', () => {
    const { container } = render(
      <GradientAlertIcon
        id='test'
        shape='circle'
      />
    )
    const gradient = container.querySelector('linearGradient')
    expect(gradient).toHaveAttribute('id', 'testGradient-circle')
  })

  it('renders gradient stops', () => {
    const { container } = render(<GradientAlertIcon />)
    const stops = container.querySelectorAll('stop')
    expect(stops).toHaveLength(2)
  })

  it('renders a path element for the shape', () => {
    const { container } = render(<GradientAlertIcon />)
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path?.getAttribute('d')).toBeTruthy()
  })

  it.each(['circle', 'triangle', 'diamond'] as const)(
    'renders %s shape',
    (shape) => {
      const { container } = render(<GradientAlertIcon shape={shape} />)
      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
    }
  )
})
