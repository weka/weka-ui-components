import { useEffect } from 'react'
import { ExtendedTable } from '../types'
import { ROWS_PER_PAGE_RATIO, ROW_HEIGHT } from '../tableConsts'
import _ from 'lodash'

function usePageSize<Data>({
  table,
  tableRef,
  miniTable,
  fixedPageSize,
  data
}: {
  table: ExtendedTable<Data>
  tableRef: React.RefObject<HTMLDivElement>
  miniTable?: boolean
  fixedPageSize: number | undefined
  data: Data[]
}) {
  useEffect(() => {
    if (miniTable) {
      table.setPageSize(data.length)
      return
    }

    if (fixedPageSize) {
      table.setPageSize(fixedPageSize)
      return
    }

    const calcNumberOfRows = _.debounce(() => {
      const tableHeight = tableRef.current?.clientHeight
      if (tableHeight) {
        table.setPageSize(tableHeight / (ROW_HEIGHT / ROWS_PER_PAGE_RATIO))
      }
    }, 350)

    calcNumberOfRows()

    window.addEventListener('resize', calcNumberOfRows)
    return () => {
      window.removeEventListener('resize', calcNumberOfRows)
    }
  }, [data.length, fixedPageSize, miniTable, table, tableRef])
}

export default usePageSize
