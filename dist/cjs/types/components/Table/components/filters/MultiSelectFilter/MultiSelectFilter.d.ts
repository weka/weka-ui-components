/// <reference types="react" />
import { ExtendedFilterProps } from '../../../types';
import './multiSelectFilter.scss';
export interface MultiSelectFilterOptions {
    fixedOptions?: string[];
}
declare function MultiSelectFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, MultiSelectFilterOptions>): JSX.Element;
export default MultiSelectFilter;
