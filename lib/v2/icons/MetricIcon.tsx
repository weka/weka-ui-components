import type { ReactNode } from 'react'

import {
  CURRENT_COLOR,
  ICON_VARIANTS,
  type IconVariant
} from '#v2/utils/consts'

import {
  type GradientIconColor,
  GradientIconContainer
} from '../components/GradientIconContainer/GradientIconContainer'
import { scaleGlyphToContainer } from '../components/GradientIconContainer/scaleGlyphToContainer'

export interface MetricIconProps {
  width?: number
  height?: number
  extraClass?: string
  variant?: IconVariant
  color?: string
}

/**
 * Glyph geometry of a metric icon: its `viewBox` and the size it is drawn at
 * inside a 36px `GradientIconContainer`.
 */
export interface MetricIconGlyph {
  viewBox: string
  width: number
  height: number
  containerColor: GradientIconColor
}

interface MetricIconInternalProps extends MetricIconProps {
  glyph: MetricIconGlyph
  children: (fill: string) => ReactNode
}

export function MetricIcon({
  width = 24,
  height = 24,
  extraClass,
  variant = ICON_VARIANTS.CONTAINER,
  color = 'var(--gray-600)',
  glyph,
  children
}: Readonly<MetricIconInternalProps>) {
  const isContainer = variant === ICON_VARIANTS.CONTAINER
  const svgContent = (
    <svg
      className={isContainer ? undefined : extraClass}
      fill='none'
      viewBox={glyph.viewBox}
      width={isContainer ? scaleGlyphToContainer(glyph.width, width) : width}
      xmlns='http://www.w3.org/2000/svg'
      height={
        isContainer ? scaleGlyphToContainer(glyph.height, height) : height
      }
    >
      {children(isContainer ? CURRENT_COLOR : color)}
    </svg>
  )

  if (!isContainer) {
    return svgContent
  }

  return (
    <GradientIconContainer
      color={glyph.containerColor}
      extraClass={extraClass}
      height={height}
      width={width}
    >
      {svgContent}
    </GradientIconContainer>
  )
}
