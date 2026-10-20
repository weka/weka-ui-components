import type {
  ColumnDef,
  ColumnSizingState,
  VisibilityState
} from '@tanstack/react-table'

import { useMemo } from 'react'

import { Table } from './Table'

const STORAGE_KEY = 'storybook-table-persisted-customizations'
const DEFAULT_VISIBILITY: VisibilityState = { status: false }

interface Persisted {
  visibility?: VisibilityState
  sizing?: ColumnSizingState
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
      columns={columns}
      data={data}
      defaultColumnVisibility={DEFAULT_VISIBILITY}
      initialColumnSizing={persisted.sizing}
      initialColumnVisibility={persisted.visibility ?? DEFAULT_VISIBILITY}
      onColumnSizingChange={(sizing) => persist({ sizing })}
      onColumnVisibilityChange={(visibility) => persist({ visibility })}
      onResetToDefaults={() => localStorage.removeItem(STORAGE_KEY)}
      title='Persisted customizations'
    />
  )
}
