import type { Header } from '@tanstack/react-table'
import type { KeyboardEvent } from 'react'

import { flexRender } from '@tanstack/react-table'

import styles from './table.module.scss'

const SORT_KEYS = new Set(['Enter', ' '])

interface HeaderLabelProps<TData> {
  readonly header: Header<TData, unknown>
  readonly canSort: boolean
}

/** Renders a header's label, wired up as a keyboard-toggleable sort control when sortable. */
export function HeaderLabel<TData>({
  header,
  canSort
}: Readonly<HeaderLabelProps<TData>>) {
  const label = flexRender(header.column.columnDef.header, header.getContext())

  if (!canSort) {
    return <div className={styles.headerText}>{label}</div>
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (SORT_KEYS.has(event.key)) {
      event.preventDefault()
      header.column.toggleSorting()
    }
  }

  return (
    <div
      className={styles.sortableHeader}
      onClick={header.column.getToggleSortingHandler()}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
    >
      {label}
    </div>
  )
}
