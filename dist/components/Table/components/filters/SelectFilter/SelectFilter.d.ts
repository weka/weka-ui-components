import { default as React } from 'react';
import { ExtendedFilterProps } from '../../../types';
export interface SelectFilterOptions {
    fixedOptions?: string[];
}
declare function SelectFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, SelectFilterOptions>): React.JSX.Element;
export default SelectFilter;
