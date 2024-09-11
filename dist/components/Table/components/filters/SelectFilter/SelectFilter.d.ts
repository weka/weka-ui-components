import { ExtendedFilterProps } from '../../../types';
export interface SelectFilterOptions {
    fixedOptions?: string[];
}
declare function SelectFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, SelectFilterOptions>): JSX.Element;
export default SelectFilter;
