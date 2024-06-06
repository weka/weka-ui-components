/// <reference types="react" />
import { ExtendedFilterProps } from '../../../types';
import './dateFilter.scss';
export type DateFilterOptions = {
    enableCustomFormat?: boolean;
    customFormat?: string;
};
export interface DateFilterValue {
    startTime?: string;
    endTime?: string;
}
export declare const isDateFilterValue: (obj: unknown) => obj is DateFilterValue;
declare function DateFilter<Data>({ column, filterOptions }: ExtendedFilterProps<Data, DateFilterValue, DateFilterOptions>): JSX.Element;
export default DateFilter;
