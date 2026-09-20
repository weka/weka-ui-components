import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ICON_VARIANTS } from '#v2/utils/consts'

import { GRADIENT_ICON_COLORS } from '../components'
import { DataReductionIcon } from './DataReductionIcon'
import { ProvisioningIcon } from './ProvisioningIcon'
import { SavingIcon } from './SavingIcon'
import { SnapshotsIcon } from './SnapshotsIcon'

const CUSTOM_COLOR = 'red'
const CUSTOM_CLASS = 'custom-class'
const CONTAINER_SELECTOR = '[data-color]'

const FS_METRIC_ICONS = [
  ['ProvisioningIcon', ProvisioningIcon, GRADIENT_ICON_COLORS.PURPLE],
  ['SnapshotsIcon', SnapshotsIcon, GRADIENT_ICON_COLORS.FUCHSIA],
  ['DataReductionIcon', DataReductionIcon, GRADIENT_ICON_COLORS.PEACH],
  ['SavingIcon', SavingIcon, GRADIENT_ICON_COLORS.YELLOW]
] as const

describe.each(FS_METRIC_ICONS)('%s', (_name, Icon, expectedColor) => {
  it('renders inside its colored gradient container by default', () => {
    const { container } = render(<Icon />)
    const iconContainer = container.querySelector(CONTAINER_SELECTOR)
    expect(iconContainer).toHaveAttribute('data-color', expectedColor)
    expect(iconContainer?.querySelector('svg')).toBeInTheDocument()
  })

  it('fills the glyph with currentColor inside the container', () => {
    const { container } = render(<Icon />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
    paths.forEach((path) => {
      expect(path).toHaveAttribute('fill', 'currentColor')
    })
  })

  it('renders only the glyph with the given color in svg-only mode', () => {
    const { container } = render(
      <Icon
        color={CUSTOM_COLOR}
        variant={ICON_VARIANTS.SVG_ONLY}
      />
    )
    expect(container.querySelector(CONTAINER_SELECTOR)).not.toBeInTheDocument()
    container.querySelectorAll('path').forEach((path) => {
      expect(path).toHaveAttribute('fill', CUSTOM_COLOR)
    })
  })

  it('applies the extra class to the container', () => {
    const { container } = render(<Icon extraClass={CUSTOM_CLASS} />)
    expect(container.querySelector(CONTAINER_SELECTOR)).toHaveClass(
      CUSTOM_CLASS
    )
  })

  it('applies the extra class to the svg in svg-only mode', () => {
    const { container } = render(
      <Icon
        extraClass={CUSTOM_CLASS}
        variant={ICON_VARIANTS.SVG_ONLY}
      />
    )
    expect(container.querySelector('svg')).toHaveClass(CUSTOM_CLASS)
  })
})
