/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
import './dateCell.scss';
export interface DateCellOptions {
    showMili?: boolean;
    showRelative?: boolean;
    relativeOnly?: boolean;
    enableCustomFormat?: boolean;
    customFormat?: string;
}
type DateCellValue = string;
export declare const DateCellName = "DateCell";
declare function DateCell<Data>(props: ExtendedCellProps<Data, DateCellValue>): JSX.Element;
export default DateCell;
