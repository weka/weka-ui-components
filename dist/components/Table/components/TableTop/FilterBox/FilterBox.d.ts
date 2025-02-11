import { default as React } from 'react';
import { ExtendedColumn } from '../../../types';
interface FilterBoxProps<Data, Value> {
    column: ExtendedColumn<Data, Value>;
    hasCustomDateFormat?: boolean;
    customDateFormat?: string;
}
declare function FilterBox<Data, Value>(props: FilterBoxProps<Data, Value>): React.JSX.Element;
export default FilterBox;
