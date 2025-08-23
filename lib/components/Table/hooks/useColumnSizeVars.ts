import { useMemo } from 'react'
import { ExtendedTable } from '../types'
import Utils from 'utils'

/**
 * Instead of calling `column.getSize()` on every render for every header
 * and especially every data cell (very expensive),
 * we will calculate all column sizes at once at the root table level in a useMemo
 * and pass the column sizes down as CSS variables to the <table> element.
 */
function useColumnSizeVars<Data>({ table }: { table: ExtendedTable<Data> }) {
  const { columnSizingInfo, columnSizing } = table.getState()

  const columnSizeVars = useMemo(() => {
    void columnSizingInfo
    void columnSizing

    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}

    headers.forEach((header) => {
      colSizes[Utils.makeCssVarName('header', header.id, 'size')] =
        header.getSize()
      colSizes[Utils.makeCssVarName('col', header.column.id, 'size')] =
        header.column.getSize()
    })

    return colSizes
  }, [columnSizingInfo, columnSizing, table])

  return columnSizeVars
}

export default useColumnSizeVars
