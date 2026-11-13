import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ActivityFillIcon } from './ActivityFillIcon'
import { AnalyticsFillIcon } from './AnalyticsFillIcon'
import { CapacityFillIcon } from './CapacityFillIcon'
import { CodeForkIcon } from './CodeForkIcon'
import { DashboardFillIcon } from './DashboardFillIcon'
import { DistributionFillIcon } from './DistributionFillIcon'
import { GridFillIcon } from './GridFillIcon'
import { MegaphoneFillIcon } from './MegaphoneFillIcon'
import { MultiTenantFillIcon } from './MultiTenantFillIcon'
import { ServersFillIcon } from './ServersFillIcon'
import { SettingsFillIcon } from './SettingsFillIcon'
import { TerminalFillIcon } from './TerminalFillIcon'
import { UserFillIcon } from './UserFillIcon'
import { WorkflowFillIcon } from './WorkflowFillIcon'

const DEFAULT_COLOR = 'currentColor'
const CUSTOM_COLOR = 'red'
const CUSTOM_CLASS = 'custom-class'
const DEFAULT_SIZE = '24'
const CUSTOM_SIZE = 16

const FIGMA_LAYER_COUNTS = {
  ActivityFillIcon: 1,
  AnalyticsFillIcon: 4,
  CapacityFillIcon: 2,
  CodeForkIcon: 1,
  DashboardFillIcon: 4,
  DistributionFillIcon: 3,
  GridFillIcon: 1,
  MegaphoneFillIcon: 4,
  MultiTenantFillIcon: 4,
  ServersFillIcon: 1,
  SettingsFillIcon: 1,
  TerminalFillIcon: 1,
  UserFillIcon: 1,
  WorkflowFillIcon: 7
}

const NAVIGATION_FILL_ICONS = [
  ['ActivityFillIcon', ActivityFillIcon, FIGMA_LAYER_COUNTS.ActivityFillIcon],
  [
    'AnalyticsFillIcon',
    AnalyticsFillIcon,
    FIGMA_LAYER_COUNTS.AnalyticsFillIcon
  ],
  ['CapacityFillIcon', CapacityFillIcon, FIGMA_LAYER_COUNTS.CapacityFillIcon],
  ['CodeForkIcon', CodeForkIcon, FIGMA_LAYER_COUNTS.CodeForkIcon],
  [
    'DashboardFillIcon',
    DashboardFillIcon,
    FIGMA_LAYER_COUNTS.DashboardFillIcon
  ],
  [
    'DistributionFillIcon',
    DistributionFillIcon,
    FIGMA_LAYER_COUNTS.DistributionFillIcon
  ],
  ['GridFillIcon', GridFillIcon, FIGMA_LAYER_COUNTS.GridFillIcon],
  [
    'MegaphoneFillIcon',
    MegaphoneFillIcon,
    FIGMA_LAYER_COUNTS.MegaphoneFillIcon
  ],
  [
    'MultiTenantFillIcon',
    MultiTenantFillIcon,
    FIGMA_LAYER_COUNTS.MultiTenantFillIcon
  ],
  ['ServersFillIcon', ServersFillIcon, FIGMA_LAYER_COUNTS.ServersFillIcon],
  ['SettingsFillIcon', SettingsFillIcon, FIGMA_LAYER_COUNTS.SettingsFillIcon],
  ['TerminalFillIcon', TerminalFillIcon, FIGMA_LAYER_COUNTS.TerminalFillIcon],
  ['UserFillIcon', UserFillIcon, FIGMA_LAYER_COUNTS.UserFillIcon],
  ['WorkflowFillIcon', WorkflowFillIcon, FIGMA_LAYER_COUNTS.WorkflowFillIcon]
] as const

describe.each(NAVIGATION_FILL_ICONS)('%s', (_name, Icon, expectedPathCount) => {
  it('renders a 24x24 svg by default', () => {
    const { container } = render(<Icon />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', DEFAULT_SIZE)
    expect(svg).toHaveAttribute('height', DEFAULT_SIZE)
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  })

  it('keeps one path per Figma layer, filled with currentColor', () => {
    const { container } = render(<Icon />)
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(expectedPathCount)
    paths.forEach((path) => {
      expect(path).toHaveAttribute('fill', DEFAULT_COLOR)
    })
  })

  it('fills every path with the given color', () => {
    const { container } = render(<Icon color={CUSTOM_COLOR} />)
    container.querySelectorAll('path').forEach((path) => {
      expect(path).toHaveAttribute('fill', CUSTOM_COLOR)
    })
  })

  it('applies the given size and extra class to the svg', () => {
    const { container } = render(
      <Icon
        extraClass={CUSTOM_CLASS}
        height={CUSTOM_SIZE}
        width={CUSTOM_SIZE}
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass(CUSTOM_CLASS)
    expect(svg).toHaveAttribute('width', String(CUSTOM_SIZE))
    expect(svg).toHaveAttribute('height', String(CUSTOM_SIZE))
  })
})
