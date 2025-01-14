import { default as React } from 'react';
import { ExtendedFilterProps } from '../../../types';
export interface MultiSelectFilterOptions {
    fixedOptions?: string[];
}
declare function MultiSelectFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, MultiSelectFilterOptions>): React.JSX.Element;
export default MultiSelectFilter;
