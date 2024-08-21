import { OptionProps } from 'react-select';
interface SelectOptionProps extends OptionProps {
    data: any;
}
declare function SelectOption(props: SelectOptionProps): JSX.Element;
export default SelectOption;
