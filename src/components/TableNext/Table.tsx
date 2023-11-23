import { useReactTable } from '@tanstack/react-table'

interface TableProps<Data extends Record<string, unknown>> {
    columns: Column<Data>[]
    data: Data[]
    filterCategory: string
    title?: string
    maxRows?: number
    rowActions?: RowAction[]
    emptyMessage?: string
    tableActions?: Array<ReactNode>
    defaultSort?: string
    globalFilter?: string | ((rows: Array<Row>) => Row[])
    defaultGlobalFilter?: string
    checkRowSelected?: (row: object) => boolean
    checkRowHighlighted?: (row: object) => boolean
    getRowId?: (
      originalRow: object,
      relativeIndex: number,
      parent?: Row<object> | undefined
    ) => string
    addFilterToUrl?: boolean
    RowSubComponent?: React.FC<{ row: any }>
    listenerPrefix?: string
    onRowClick?: (row?: Row) => void
    miniTable?: boolean
    fixedPageSize?: number
    disableActionsPortal?: boolean
    colPropForShowColumns?: string
    manualPagination?: boolean
    itemsAmount?: number
    canExpandAll?: boolean
    loading?: boolean
    onFiltersChanged?: (newFilters: Filters<object>) => void
    defaultDescendingSort?: boolean
    customRowActions?: CustomRowAction[]
    manualFilters?: boolean
    initialFilters?: Filter[]
    extraClasses?: {
      tableWrapper?: string
      tableLine?: string
      expandCell?: string
      tableCell?: string
    }
    /**
     * Must be memoized
     */
    groupBy?: string[]
    hasCustomDateFormat?: boolean
    customDateFormat?: string
    hasResizableColumns?: boolean
    hasEmptyActionsCell?: boolean
    collapseRowsOnLeavingPage?: boolean
    onSortChanged: (sort: { id: string; desc?: boolean }) => void
    manualSorting?: boolean
  }

function Table<Values extends Record<string, unknown>>(props: TableProps<Values>) {
    return 'Table next'

}

export default Table