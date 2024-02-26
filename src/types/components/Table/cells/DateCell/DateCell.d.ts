/// <reference types="react" />
import { CellProps } from 'react-table';
import './dateCell.scss';
declare function DateCell({ cell, column }: {
    cell: CellProps<object>;
    column: {
        [key: string]: any;
    };
}): JSX.Element;
export default DateCell;
