import { default as React } from 'react';
import { ExtendedTable } from '../../types';
interface TableTopProps<Data> {
    table: ExtendedTable<Data>;
    title?: string;
    itemsAmount?: number;
    maxRows?: number;
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
export declare function TableTop<Data>(props: TableTopProps<Data>): React.JSX.Element;
export default TableTop;
