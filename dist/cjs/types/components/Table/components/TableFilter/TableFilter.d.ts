/// <reference types="react" />
import { TABLE_FILTERS_MAP } from '../../tableConsts';
import { BaseFilterProps } from '../../types';
export type FilterTypes = keyof typeof TABLE_FILTERS_MAP;
declare function TableFilter<Data>(props: BaseFilterProps<Data, unknown>): JSX.Element;
export default TableFilter;
