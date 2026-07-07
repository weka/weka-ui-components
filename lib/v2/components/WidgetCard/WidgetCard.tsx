import type { ReactNode } from 'react'

import { DashboardCard } from '../DashboardCard'
import { LoadingState, STATE_TYPES } from '../LoadingState'

export interface WidgetCardProps<T> {
  title: string
  tooltip?: string
  data: T | null
  children: (data: T) => ReactNode
}

/**
 * A dashboard slot: renders `children(data)` once the widget data is
 * available, and a loading state until then. Keeps widgets null-safe
 * (children only run with non-null data) while sharing the card + loading
 * boilerplate.
 */
export function WidgetCard<T>({
  title,
  tooltip,
  data,
  children
}: Readonly<WidgetCardProps<T>>) {
  return (
    <DashboardCard
      title={title}
      tooltip={tooltip}
    >
      {data != null ? (
        children(data)
      ) : (
        <LoadingState type={STATE_TYPES.LOADING} />
      )}
    </DashboardCard>
  )
}
