import type { CSSProperties, ReactNode } from 'react'

import { EMPTY_OBJECT, EMPTY_STRING } from '../../utils/consts'

type JustifyContentValue =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

export interface FlexBoxProps {
  children: ReactNode
  direction?: 'row' | 'column'
  gap?: number | string
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: JustifyContentValue
  wrap?: boolean
  extraClass?: string
  style?: CSSProperties
}

export function FlexBox({
  children,
  direction = 'row',
  gap,
  align = 'center',
  justify = 'flex-start',
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
