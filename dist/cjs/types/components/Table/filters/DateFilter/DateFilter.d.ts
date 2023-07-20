/// <reference types="react" />
import { UseFiltersColumnProps } from 'react-table';
import './dateFilter.scss';
interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
    Header: string;
    id?: string;
    customTitle?: string;
}
interface DateFilterProps {
    column: ExtendedFiltersColumn<object>;
}
export interface DateFilterValue {
    startTime?: string;
    endTime?: string;
}
export declare const isDateFilterValue: (obj: unknown) => obj is DateFilterValue;
declare function DateFilter({ column }: DateFilterProps): JSX.Element;
export default DateFilter;
