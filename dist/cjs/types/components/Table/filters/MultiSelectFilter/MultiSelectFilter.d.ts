/// <reference types="react" />
import { UseFiltersColumnProps } from 'react-table';
import './multiSelectFilter.scss';
interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
    fixedOptions: Array<any>;
    Header: string;
    id?: string;
    [key: string]: any;
}
declare function MultiSelectFilter({ column }: ExtendedFiltersColumn<object>): JSX.Element;
export default MultiSelectFilter;
