import { ExtendedCellProps } from '../../../types';
export interface DateCellOptions {
    showMili?: boolean;
    showRelative?: boolean;
    relativeOnly?: boolean;
    enableCustomFormat?: boolean;
    customFormat?: string;
}
export type DateCellValue = string;
export declare const DateCellName = "DateCell";
declare function DateCell<Data>(props: ExtendedCellProps<Data, DateCellValue>): JSX.Element;
export default DateCell;
