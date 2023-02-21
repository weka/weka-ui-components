import React, { ReactNode } from 'react';
import { Row, Column, UseExpandedRowProps, UseRowStateRowProps, CellProps } from 'react-table';
import './table.scss';
export interface RowAction {
    hideAction: boolean | ((original: object) => boolean);
    action?: ((original: object) => void) | (() => void);
    content?: string | ((original: object) => HTMLElement);
    disabled?: boolean | ((original: object) => boolean);
    text?: string;
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
    getRowId?: ((originalRow: object, relativeIndex: number, parent?: (Row<object> | undefined)) => string);
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
}
declare function Table({ columns, data, rowActions, tableActions, title, defaultSort, globalFilter, defaultGlobalFilter, checkRowSelected, getRowId, addFilterToUrl, RowSubComponent, listenerPrefix, onRowClick, miniTable, filterCategory, fixedPageSize, disableActionsPortal, maxRows, emptyMessage, colPropForShowColumns }: TableProps): JSX.Element;
export default Table;
