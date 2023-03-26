/// <reference types="react" />
import { UseFiltersColumnProps } from 'react-table';
import './selectFilter.scss';
interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
    fixedOptions: Array<any>;
    Header: string;
    id?: string;
    [key: string]: any;
}
declare function SelectFilter({ column }: ExtendedFiltersColumn<object>): JSX.Element;
export default SelectFilter;
