/// <reference types="react" />
import { OptionProps } from 'react-select';
import './selectOption.scss';
interface SelectOptionProps extends OptionProps {
    data: any;
}
declare function SelectOption(props: SelectOptionProps): JSX.Element;
export default SelectOption;
