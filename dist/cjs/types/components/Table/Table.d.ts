import React, { ReactNode } from 'react';
import { Row, Column, UseExpandedRowProps, UseRowStateRowProps, CellProps, Filters } from 'react-table';
import './table.scss';
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
export interface CustomCellProps {
    cell: CellProps<object>;
}
declare type ExtendedColumn = Column & {
    defaultHidden?: boolean;
};
export interface ExtendedRow<T extends object> extends Row, UseExpandedRowProps<T>, UseRowStateRowProps<T> {
    subRows: Array<Row<any>>;
}
interface TableProps {
    columns: ExtendedColumn[];
    data: Array<any>;
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
    extraClass?: string;
}
declare function Table({ columns, data, rowActions, tableActions, title, defaultSort, globalFilter, defaultGlobalFilter, checkRowSelected, checkRowHighlighted, getRowId, addFilterToUrl, RowSubComponent, listenerPrefix, onRowClick, miniTable, filterCategory, fixedPageSize, disableActionsPortal, maxRows, emptyMessage, colPropForShowColumns, manualPagination, itemsAmount, canExpandAll, loading, onFiltersChanged, defaultDescendingSort, customRowActions, manualFilters, extraClass, initialFilters: initialUserFilters }: TableProps): JSX.Element;
export default Table;
