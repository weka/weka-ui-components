import type { ComponentType, ReactNode } from 'react'

export const TAB_VARIANTS = {
  PRIMARY: 'primary',
  UNDERLINE: 'underline',
  EDITABLE: 'editable'
} as const

export type TabVariant = (typeof TAB_VARIANTS)[keyof typeof TAB_VARIANTS]

export const SCROLL_DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right'
} as const

export type ScrollDirection =
  (typeof SCROLL_DIRECTIONS)[keyof typeof SCROLL_DIRECTIONS]

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  Icon?: ComponentType<{ width?: number; height?: number; color?: string }>
  count?: number
  maxCount?: number
  subTab?: string
  isLocked?: boolean
}
