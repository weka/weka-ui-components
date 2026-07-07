import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  ErrorIcon,
  InfoIcon,
  LoadingIcon,
  SuccessIcon,
  WarningIcon
} from './ToastIcons'

describe('SuccessIcon', () => {
  it('renders an SVG with the default size of 40', () => {
    const { container } = render(<SuccessIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('renders with a custom size', () => {
    const { container } = render(<SuccessIcon size={24} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('fills the path from its own gradient', () => {
    const { container } = render(<SuccessIcon />)
    const gradientId = container.querySelector('linearGradient')?.id
    expect(gradientId).toBeTruthy()
    expect(container.querySelectorAll('stop')).toHaveLength(2)
    expect(container.querySelector('path')).toHaveAttribute(
      'fill',
      `url(#${gradientId})`
    )
  })
})

describe('LoadingIcon', () => {
  it('renders an SVG with the default size of 40', () => {
    const { container } = render(<LoadingIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('renders with a custom size', () => {
    const { container } = render(<LoadingIcon size={24} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('applies the spinner animation class', () => {
    const { container } = render(<LoadingIcon />)
    expect(container.querySelector('svg')).toHaveClass('toastLoadingSpinner')
  })

  it('strokes the spinner circle from its own gradient', () => {
    const { container } = render(<LoadingIcon />)
    const gradientId = container.querySelector('linearGradient')?.id
    expect(gradientId).toBeTruthy()
    expect(container.querySelectorAll('stop')).toHaveLength(2)
    expect(container.querySelector('circle')).toHaveAttribute(
      'stroke',
      `url(#${gradientId})`
    )
  })
})

describe('GradientAlertIcon-backed toast icons', () => {
  it.each([
    { name: 'ErrorIcon', Icon: ErrorIcon },
    { name: 'WarningIcon', Icon: WarningIcon },
    { name: 'InfoIcon', Icon: InfoIcon }
  ])('$name fills its path from its own gradient', ({ Icon }) => {
    const { container } = render(<Icon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
    const gradientId = container.querySelector('linearGradient')?.id
    expect(gradientId).toBeTruthy()
    expect(container.querySelectorAll('stop')).toHaveLength(2)
    expect(container.querySelector('path')).toHaveAttribute(
      'fill',
      `url(#${gradientId})`
    )
  })
})

describe('gradient id uniqueness', () => {
  it.each([
    { name: 'SuccessIcon', Icon: SuccessIcon },
    { name: 'ErrorIcon', Icon: ErrorIcon },
    { name: 'LoadingIcon', Icon: LoadingIcon }
  ])('two $name instances get distinct gradient ids', ({ Icon }) => {
    const { container } = render(
      <>
        <Icon />
        <Icon />
      </>
    )
    const gradients = container.querySelectorAll('linearGradient')
    expect(gradients).toHaveLength(2)
    expect(gradients[0].id).not.toBe(gradients[1].id)
  })
})
