/// <reference types="react" />
import './filterBox.scss';
interface FilterBoxProps {
    name: string;
    value: string | Array<string> | Record<string, unknown>;
    onDelete: () => void;
}
declare function FilterBox({ name, value: value, onDelete }: FilterBoxProps): JSX.Element;
export default FilterBox;
