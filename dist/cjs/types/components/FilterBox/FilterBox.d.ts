/// <reference types="react" />
import './filterBox.scss';
interface FilterBoxProps {
    name: string;
    text: string | Array<string>;
    onDelete: () => void;
}
declare function FilterBox({ name, text, onDelete }: FilterBoxProps): JSX.Element;
export default FilterBox;
