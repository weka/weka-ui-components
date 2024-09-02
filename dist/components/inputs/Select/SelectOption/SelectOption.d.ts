import { default as React } from 'react';
import { OptionProps } from 'react-select';
interface SelectOptionProps extends OptionProps {
    data: {
        label: string;
        icon?: React.ReactNode;
        tooltip?: string;
        subLabel?: string;
    };
}
declare function SelectOption(props: SelectOptionProps): JSX.Element;
export default SelectOption;
