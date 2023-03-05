/// <reference types="react" />
import { UseFiltersColumnProps } from 'react-table';
import './severityFilter.scss';
interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
    fixedOptions: Array<any>;
    Header: string;
    id?: string;
    [key: string]: any;
}
declare function SeverityFilter({ column: { filterValue, setFilter, Header, columnName } }: {
    column: ExtendedFiltersColumn<object>;
}): JSX.Element;
export default SeverityFilter;
