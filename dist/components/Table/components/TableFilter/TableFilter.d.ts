import { TABLE_FILTERS_MAP } from '../../tableConsts';
import { BaseFilterProps } from '../../types';
import { default as React } from 'react';
export type FilterTypes = keyof typeof TABLE_FILTERS_MAP;
declare function TableFilter<Data>(props: BaseFilterProps<Data, unknown>): React.JSX.Element;
export default TableFilter;
