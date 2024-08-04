import { ExtendedFilterProps } from '../../../types';

export interface MultiSelectFilterOptions {
    fixedOptions?: string[];
}
declare function MultiSelectFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, MultiSelectFilterOptions>): JSX.Element;
export default MultiSelectFilter;
