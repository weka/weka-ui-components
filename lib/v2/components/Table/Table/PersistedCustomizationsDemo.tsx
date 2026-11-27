import type { ColumnReorderConfig } from './columnOrder'
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  VisibilityState
} from '@tanstack/react-table'

import { useMemo } from 'react'

import { Table } from './Table'

const STORAGE_KEY = 'storybook-table-persisted-customizations'
const DEFAULT_VISIBILITY: VisibilityState = { status: false }
const COLUMN_REORDER: ColumnReorderConfig = { lockedStart: 1 }

interface Persisted {
  visibility?: VisibilityState
  sizing?: ColumnSizingState
  order?: ColumnOrderState
}

interface PersistedCustomizationsDemoProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

function readPersisted(): Persisted {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function persist(patch: Persisted) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...readPersisted(), ...patch })
  )
}

export function PersistedCustomizationsDemo<TData>({
  columns,
  data
}: Readonly<PersistedCustomizationsDemoProps<TData>>) {
  const persisted = useMemo(() => readPersisted(), [])

  return (
    <Table
      columnReorder={COLUMN_REORDER}
      columns={columns}
      data={data}
      defaultColumnVisibility={DEFAULT_VISIBILITY}
      initialColumnOrder={persisted.order}
      initialColumnSizing={persisted.sizing}
      initialColumnVisibility={persisted.visibility ?? DEFAULT_VISIBILITY}
      onColumnOrderChange={(order) => persist({ order })}
      onColumnSizingChange={(sizing) => persist({ sizing })}
      onColumnVisibilityChange={(visibility) => persist({ visibility })}
      onResetToDefaults={() => localStorage.removeItem(STORAGE_KEY)}
      title='Persisted customizations'
    />
  )
}
