import type { CSSProperties, ReactNode } from 'react'

import { EMPTY_OBJECT, EMPTY_STRING } from '../../utils/consts'

export const FLEX_DIRECTIONS = {
  ROW: 'row',
  COLUMN: 'column'
} as const

export type FlexDirection =
  (typeof FLEX_DIRECTIONS)[keyof typeof FLEX_DIRECTIONS]

export const FLEX_ALIGNS = {
  FLEX_START: 'flex-start',
  CENTER: 'center',
  FLEX_END: 'flex-end',
  STRETCH: 'stretch'
} as const

export type FlexAlign = (typeof FLEX_ALIGNS)[keyof typeof FLEX_ALIGNS]

export const FLEX_JUSTIFIES = {
  FLEX_START: 'flex-start',
  CENTER: 'center',
  FLEX_END: 'flex-end',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly'
} as const

export type FlexJustify =
  (typeof FLEX_JUSTIFIES)[keyof typeof FLEX_JUSTIFIES]

export interface FlexBoxProps {
  children: ReactNode
  direction?: FlexDirection
  gap?: number | string
  align?: FlexAlign
  justify?: FlexJustify
  wrap?: boolean
  extraClass?: string
  style?: CSSProperties
}

export function FlexBox({
  children,
  direction = FLEX_DIRECTIONS.ROW,
  gap,
  align = FLEX_ALIGNS.CENTER,
  justify = FLEX_JUSTIFIES.FLEX_START,
  wrap = false,
  extraClass = EMPTY_STRING,
  style = EMPTY_OBJECT
}: Readonly<FlexBoxProps>) {
  const flexStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    ...style
  }

  return (
    <div
      className={extraClass}
      style={flexStyle}
    >
      {children}
    </div>
  )
}
