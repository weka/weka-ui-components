import React, { ReactNode } from 'react';
import { Row, Column as RTColumn, UseExpandedRowProps, UseRowStateRowProps, CellProps, Filters } from 'react-table';
import SelectFilter from './filters/SelectFilter';
import MultiSelectFilter from './filters/MultiSelectFilter';
import DateFilter from './filters/DateFilter';
import SeverityFilter from './filters/SeverityFilter';
import TextFilter from './filters/TextFilter';
import { UrlFilterParser } from './hooks/useUrlFilters';
import './table.scss';
export declare const filterParsersMap: Map<FilterComponent, UrlFilterParser>;
export declare const stringParser: UrlFilterParser;
export declare type FilterComponent = typeof DateFilter | typeof MultiSelectFilter | typeof SelectFilter | typeof SeverityFilter | typeof TextFilter;
export interface RowAction {
    hideAction: boolean | ((original: object) => boolean);
    action?: ((original: object) => void) | (() => void);
    content?: string | ((original: object) => HTMLElement);
    disabled?: boolean | ((original: object) => boolean);
    text?: string;
}
export interface CustomRowAction {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean | ((original: object) => boolean);
    onClick: ((original: object) => void) | (() => void);
    tooltipText?: any;
    extraClass?: string;
}
export interface CustomCellProps<Data extends Record<string, unknown>> {
    cell: CellProps<Data>;
    column: Column<Data>;
}
export declare type Column<Data extends Record<string, unknown>> = Omit<RTColumn<Data>, 'Filter' | 'Cell' | 'id' | 'accessor'> & {
    onClickCell?: (values: Data) => void;
    Cell?: React.FC<CustomCellProps<Data>>;
    defaultHidden?: boolean;
    Filter?: FilterComponent;
    filter?: string | ((rows: Row<Data>[], columnIds: string[], filterValue: any) => Row<Data>[]);
    sortType?: 'number' | ((rowA: Row<Data>, rowB: Row<Data>, columnId: string, desc: boolean) => number);
} & ({
    id?: string;
    accessor: string;
} | {
    id: string;
    accessor: (originalRow: Data, rowIndex: number) => unknown;
});
export interface ExtendedRow<T extends object> extends Row, UseExpandedRowProps<T>, UseRowStateRowProps<T> {
    subRows: Array<Row<any>>;
}
interface TableProps<Data extends Record<string, unknown>> {
    columns: Column<Data>[];
    data: Data[];
    filterCategory: string;
    title?: string;
    maxRows?: number;
    rowActions?: RowAction[];
    emptyMessage?: string;
    tableActions?: Array<ReactNode>;
    defaultSort?: string;
    globalFilter?: string | ((rows: Array<Row>) => Row[]);
    defaultGlobalFilter?: string;
    checkRowSelected?: (row: object) => boolean;
    checkRowHighlighted?: (row: object) => boolean;
    getRowId?: (originalRow: object, relativeIndex: number, parent?: Row<object> | undefined) => string;
    addFilterToUrl?: boolean;
    RowSubComponent?: React.FC<{
        row: any;
    }>;
    listenerPrefix?: string;
    onRowClick?: (row?: Row) => void;
    miniTable?: boolean;
    fixedPageSize?: number;
    disableActionsPortal?: boolean;
    colPropForShowColumns?: string;
    manualPagination?: boolean;
    itemsAmount?: number;
    canExpandAll?: boolean;
    loading?: boolean;
    onFiltersChanged?: (newFilters: Filters<object>) => void;
    defaultDescendingSort?: boolean;
    customRowActions?: CustomRowAction[];
    manualFilters?: boolean;
    initialFilters?: Filter[];
    extraClasses?: {
        tableWrapper?: string;
        tableLine?: string;
        expandCell?: string;
        tableCell?: string;
    };
    /**
     * Must be memoized
     */
    groupBy?: string[];
    hasCustomDateFormat?: boolean;
    customDateFormat?: string;
}
declare function Table<Values extends Record<string, unknown>>({ columns, data, rowActions, tableActions, title, defaultSort, globalFilter, defaultGlobalFilter, checkRowSelected, checkRowHighlighted, getRowId, addFilterToUrl, RowSubComponent, listenerPrefix, onRowClick, miniTable, filterCategory, fixedPageSize, disableActionsPortal, maxRows, emptyMessage, colPropForShowColumns, manualPagination, itemsAmount, canExpandAll, loading, onFiltersChanged, defaultDescendingSort, customRowActions, manualFilters, extraClasses, initialFilters: initialUserFilters, groupBy, hasCustomDateFormat, customDateFormat }: TableProps<Values>): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Table>;
export default _default;
