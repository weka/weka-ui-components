import { ExtendedRow, TableExtraClasses, ExtendedCell } from '../../types';
import { FC } from 'react';
interface TableCellProps<Data, Value> {
    cell: ExtendedCell<Data, Value>;
    row: ExtendedRow<Data>;
    extraClasses?: TableExtraClasses;
    onRowClick?: (values: Data) => void;
    RowSubComponent?: FC;
    grouping?: string[];
    rowIndex: number;
}
declare function TableCell<Data, Value>(props: TableCellProps<Data, Value>): JSX.Element;
export default TableCell;
