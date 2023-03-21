/// <reference types="react" />
import './dateFilter.scss';
interface DateFilterDefault {
    startTime?: string;
    endTime?: string;
}
interface DateFilter {
    start_time?: string;
    end_time?: string;
}
interface DateFilterProps {
    setFilter: (filter: DateFilter) => void;
    defaultValue?: DateFilterDefault;
}
declare function DateFilter(props: DateFilterProps): JSX.Element;
export default DateFilter;
