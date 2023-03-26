/// <reference types="react" />
import { UseFiltersColumnProps } from 'react-table';
import './severityFilter.scss';
interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
    Header: string;
    [key: string]: any;
    byMinSeverity?: boolean;
}
declare function SeverityFilter({ column }: ExtendedFiltersColumn<object>): JSX.Element;
export default SeverityFilter;
