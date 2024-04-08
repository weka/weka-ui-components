/// <reference types="react" />
import { ExtendedColumn } from '../../../types';
import './filterBox.scss';
interface FilterBoxProps<Data, Value> {
    column: ExtendedColumn<Data, Value>;
    hasCustomDateFormat?: boolean;
    customDateFormat?: string;
}
declare function FilterBox<Data, Value>(props: FilterBoxProps<Data, Value>): JSX.Element;
export default FilterBox;
