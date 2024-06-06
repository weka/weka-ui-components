/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
import './statusCell.scss';
export interface StatusCellOptions<Data> {
    getTooltip?: (rowValues: Data) => string;
    showString?: boolean;
}
export type StatusCellValue = string | null;
export declare const StatusCellName = "StatusCell";
declare function StatusCell<Data>(props: ExtendedCellProps<Data, StatusCellValue>): JSX.Element;
export default StatusCell;
