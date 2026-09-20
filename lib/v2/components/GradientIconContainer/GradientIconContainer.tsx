import type { ReactNode } from 'react'

import clsx from 'clsx'

import { GRADIENT_ICON_CONTAINER_SIZE } from './scaleGlyphToContainer'

import styles from './gradientIconContainer.module.scss'

export const GRADIENT_ICON_COLORS = {
  PURPLE: 'purple',
  FUCHSIA: 'fuchsia',
  PEACH: 'peach',
  YELLOW: 'yellow'
} as const

export type GradientIconColor =
  (typeof GRADIENT_ICON_COLORS)[keyof typeof GRADIENT_ICON_COLORS]

export interface GradientIconContainerProps {
  color: GradientIconColor
  children: ReactNode
  width?: number
  height?: number
  extraClass?: string
}

export function GradientIconContainer({
  color,
  children,
  width = GRADIENT_ICON_CONTAINER_SIZE,
  height = GRADIENT_ICON_CONTAINER_SIZE,
  extraClass
}: Readonly<GradientIconContainerProps>) {
  return (
    <div
      className={clsx(styles.container, styles[color], extraClass)}
      data-color={color}
      style={{ width, height }}
    >
      {children}
    </div>
  )
}
