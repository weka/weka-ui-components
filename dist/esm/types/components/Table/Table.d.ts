import React, { ReactNode } from 'react';
import { ColumnFilter, FilterFn } from '@tanstack/react-table';
import { ExtendedColumnFilter, ExtendedColumnDef, RowAction, TableExtraClasses, ExtendedRow } from './types';
import './table.scss';
interface TableProps<Data, Value> {
    columns: ExtendedColumnDef<Data, Value>[];
    data: Data[];
    filterCategory: string;
    title?: string;
    maxRows?: number;
    rowActions?: RowAction<Data>[];
    emptyMessage?: string;
    tableActions?: Array<ReactNode>;
    defaultSort?: string;
    globalFilter?: any;
    globalFilterFn?: FilterFn<Data>;
    defaultGlobalFilter?: string;
    checkRowSelected?: (row: object) => boolean;
    checkRowHighlighted?: (row: object) => boolean;
    getRowId?: (originalRow: Data, index: number, parent?: ExtendedRow<Data>) => string;
    addFilterToUrl?: boolean;
    RowSubComponent?: React.FC<{
        row: any;
    }>;
    listenerPrefix?: string;
    onRowClick?: (values?: Data) => void;
    miniTable?: boolean;
    fixedPageSize?: number;
    disableActionsPortal?: boolean;
    manualPagination?: boolean;
    itemsAmount?: number;
    canExpandAll?: boolean;
    loading?: boolean;
    onFiltersChanged?: (newFilters: ExtendedColumnFilter[]) => void;
    defaultDescendingSort?: boolean;
    manualFilters?: boolean;
    initialFilters?: ColumnFilter[];
    extraClasses?: TableExtraClasses;
    /**
     * Must be memoized
     */
    grouping?: string[];
    hasCustomDateFormat?: boolean;
    customDateFormat?: string;
    hasResizableColumns?: boolean;
    hasEmptyActionsCell?: boolean;
    collapseRowsOnLeavingPage?: boolean;
    onSortChanged?: (sort: {
        id: string;
        desc?: boolean;
    }) => void;
    manualSorting?: boolean;
}
declare function Table<Data, Value>(props: TableProps<Data, Value>): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Table>;
export default _default;
