/// <reference types="react" />
import './filterBox.scss';
interface FilterBoxProps {
    name: string;
    value: string | Array<string> | Record<string, unknown>;
    onDelete: () => void;
    hasCustomDateFormat?: boolean;
    customDateFormat?: string;
}
declare function FilterBox({ name, value: value, onDelete, hasCustomDateFormat, customDateFormat }: FilterBoxProps): JSX.Element;
export default FilterBox;
