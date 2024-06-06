import { ExtendedColumnDef, ExtendedColumnDefWithId } from '../../types'
import { Utils } from '../../../..'
import { useMemo } from 'react'
import { TABLE_FILTERS_MAP } from '../../tableConsts'
import * as Cells from '../../exports/cells'

function addId<Data, Value>({
  columnDefs
}: {
  columnDefs: ExtendedColumnDef<Data, Value>[]
}) {
  return columnDefs.map((column) => {
    let id = column.id

    if (!id && 'accessorKey' in column && Utils.isString(column.accessorKey)) {
      id = column.accessorKey
    }

    if (!id && Utils.isString(column.header)) {
      id = column.header
    }

    if (!id) {
      throw new Error(
        'A column must have one of the following properties: "id", "accessorKey" or "header"'
      )
    }

    return {
      ...column,
      id
    }
  })
}

function addFilterFn<Data, Value>({
  columnDefs
}: {
  columnDefs: ExtendedColumnDef<Data, Value>[]
}) {
  return columnDefs.map((column) => {
    const filterDef = column.meta?.filter
    const filter =
      typeof filterDef === 'string'
        ? filterDef
        : filterDef?.filterFn ?? filterDef?.type

    if (!filter) {
      return column
    }

    if (typeof filter === 'function') {
      return {
        ...column,
        filterFn: filter
      }
    }

    const filterConfig = TABLE_FILTERS_MAP[filter]

    const filterFn =
      'filterFn' in filterConfig ? filterConfig.filterFn : undefined

    return {
      ...column,
      ...(filterFn && { filterFn })
    }
  })
}

function addCells<Data, Value>({
  columnDefs
}: {
  columnDefs: ExtendedColumnDef<Data, Value>[]
}) {
  return columnDefs.map((column) => {
    const cellDef = column.meta?.cell

    if (!cellDef || (cellDef && column.cell)) {
      return column
    }

    if (cellDef.type in Cells) {
      return {
        ...column,
        cell: Cells[cellDef.type]
      }
    }

    throw new Error(`Unknown cell type: ${cellDef.type}`)
  })
}

function usePrepareColumnDefs<Data, Value>({
  columnDefs
}: {
  columnDefs: ExtendedColumnDef<Data, Value>[]
}): ExtendedColumnDefWithId<Data, Value>[] {
  return useMemo(() => {
    const columnDefsWithIds = addId({ columnDefs })
    const columnDefsWithFilterFns = addFilterFn({
      columnDefs: columnDefsWithIds
    })
    const columnDefsWithCells = addCells({
      columnDefs: columnDefsWithFilterFns
    })

    return columnDefsWithCells
  }, [columnDefs])
}

export default usePrepareColumnDefs
