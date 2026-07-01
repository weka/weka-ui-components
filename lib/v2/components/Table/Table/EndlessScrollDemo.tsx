import type { ColumnDef } from '@tanstack/react-table'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Table } from './Table'

const REGIONS = ['us-east-1', 'us-west-2', 'eu-central-1']
const STATUSES = ['Healthy', 'Degraded', 'Offline']
const ENDLESS_BATCH_SIZE = 20
const ENDLESS_LOAD_DELAY_MS = 800
const ENDLESS_MAX_ITEMS = 100

interface Cluster {
  id: number
  name: string
  region: string
  status: string
}

const COLUMNS: ColumnDef<Cluster>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'status', header: 'Status' }
]

const CONTAINER_STYLE = {
  padding: 24,
  background: 'var(--bg-secondary)',
  height: 520
}

function makeItems(start: number, count: number): Cluster[] {
  return Array.from({ length: count }, (_unused, i) => ({
    id: start + i + 1,
    name: `cluster-${start + i + 1}`,
    region: REGIONS[(start + i) % REGIONS.length],
    status: STATUSES[(start + i) % STATUSES.length]
  }))
}

/**
 * Storybook demo for the Table's endless-scroll mode.
 * Simulates an API that returns pages of clusters, appending rows on scroll.
 */
export function EndlessScrollDemo() {
  const [rows, setRows] = useState<Cluster[]>(() =>
    makeItems(0, ENDLESS_BATCH_SIZE)
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const hasMore = rows.length < ENDLESS_MAX_ITEMS
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    },
    []
  )

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) {
      return
    }
    setIsLoadingMore(true)
    timerRef.current = setTimeout(() => {
      setRows((prev) => [
        ...prev,
        ...makeItems(prev.length, ENDLESS_BATCH_SIZE)
      ])
      setIsLoadingMore(false)
    }, ENDLESS_LOAD_DELAY_MS)
  }, [isLoadingMore])

  return (
    <div style={CONTAINER_STYLE}>
      <Table
        columns={COLUMNS}
        data={rows}
        endless
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
        title={`Clusters (${rows.length} loaded${
          hasMore ? ', scroll for more' : ' — all loaded'
        })`}
      />
    </div>
  )
}
