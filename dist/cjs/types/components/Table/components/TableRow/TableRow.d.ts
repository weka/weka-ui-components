import { ExtendedColumn, ExtendedRow, RowAction, TableExtraClasses } from '../../types';
import React from 'react';
interface TableRowProps<Data, Value> {
    row: ExtendedRow<Data>;
    columns: ExtendedColumn<Data, Value>[];
    isExpandable?: boolean;
    grouping?: string[];
    RowSubComponent?: React.FC;
    onRowClick?: (row: Data) => void;
    checkRowSelected?: (row: Data) => boolean;
    checkRowHighlighted?: (row: Data) => boolean;
    rowActions?: RowAction<Data>[];
    hasEmptyActionsCell?: boolean;
    isResizable?: boolean;
    disableActionsPortal?: boolean;
    extraClasses?: TableExtraClasses;
    rowCanExpand?: boolean;
}
declare function TableRow<Data, Value>(props: TableRowProps<Data, Value>): JSX.Element;
export default TableRow;
