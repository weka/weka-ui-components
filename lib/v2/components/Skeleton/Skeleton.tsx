import type { CSSProperties } from 'react'

import { clsx } from 'clsx'

import styles from './skeleton.module.scss'

const DEFAULT_BORDER_RADIUS = 4

export interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  borderRadius?: CSSProperties['borderRadius']
  extraClass?: string
  dataTestId?: string
}

export function Skeleton({
  width,
  height,
  borderRadius = DEFAULT_BORDER_RADIUS,
  extraClass,
  dataTestId
}: Readonly<SkeletonProps>) {
  return (
    <div
      className={clsx(styles.skeleton, extraClass)}
      data-testid={dataTestId}
      style={{ width, height, borderRadius }}
    />
  )
}
