/// <reference types="react" />
import { ExtendedRow, ExtendedTable } from '../../types';
interface TableTopProps<Data> {
    table: ExtendedTable<Data>;
    title?: string;
    itemsAmount?: number;
    maxRows?: number;
    rows: ExtendedRow<Data>[];
    canExpandAll: boolean;
    isExpandable: boolean;
    tableActions: any;
    hasResizableColumns: boolean;
    isResizable: boolean;
    toggleResizable: () => void;
    hasCustomDateFormat?: boolean;
    customDateFormat?: string;
    toggleAllRowsExpanding: () => void;
}
export declare function TableTop<Data>(props: TableTopProps<Data>): JSX.Element;
export default TableTop;
