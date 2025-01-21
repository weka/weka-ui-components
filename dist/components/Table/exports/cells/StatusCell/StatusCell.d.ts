import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export interface StatusCellOptions<Data> {
    getTooltip?: (rowValues: Data) => string;
    showString?: boolean;
}
export type StatusCellValue = string | null;
export declare const StatusCellName = "StatusCell";
declare function StatusCell<Data>(props: ExtendedCellProps<Data, StatusCellValue>): React.JSX.Element;
export default StatusCell;
