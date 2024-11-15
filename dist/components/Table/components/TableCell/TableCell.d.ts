import { ExtendedRow, TableExtraClasses, ExtendedCell } from '../../types';
import { default as React, FC } from 'react';
interface TableCellProps<Data, Value> {
    cell: ExtendedCell<Data, Value>;
    row: ExtendedRow<Data>;
    extraClasses?: TableExtraClasses;
    onRowClick?: (values: Data) => void;
    RowSubComponent?: FC;
    grouping?: string[];
    rowIndex: number;
}
declare function TableCell<Data, Value>(props: TableCellProps<Data, Value>): React.JSX.Element;
export default TableCell;
