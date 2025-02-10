import { ExtendedColumn, ExtendedRow, RowAction, TableExtraClasses } from '../../types';
import { default as React } from 'react';
interface TableRowProps<Data, Value> {
    row: ExtendedRow<Data>;
    columns: ExtendedColumn<Data, Value>[];
    isExpandable?: boolean;
    grouping?: string[];
    RowSubComponent?: React.FC<{
        row: ExtendedRow<Data>;
    }>;
    onRowClick?: (row: Data) => void;
    onToggleExpand?: (row: ExtendedRow<Data>) => void;
    checkRowSelected?: (row: Data) => boolean;
    checkRowHighlighted?: (row: Data) => boolean;
    rowActions?: RowAction<Data>[];
    hasEmptyActionsCell?: boolean;
    isResizable?: boolean;
    disableActionsPortal?: boolean;
    extraClasses?: TableExtraClasses;
    rowCanExpand?: boolean;
    expandedRows?: Record<string, boolean>;
}
declare function TableRow<Data, Value>(props: TableRowProps<Data, Value>): React.JSX.Element;
export default TableRow;
