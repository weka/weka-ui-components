import { ReactElement } from 'react';

export declare const getStyle: (hasError: any, hasLabel: any) => {
    menuPortal: (provided: any, state: any) => any;
    menu: (base: any) => any;
    control: (base: any, state: any) => any;
    clearIndicator: (base: any, { isDisabled }: {
        isDisabled: any;
    }) => any;
    indicatorSeparator: (base: any, state: any) => any;
    dropdownIndicator: (base: any, state: any) => any;
    option: (base: any, { isDisabled }: {
        isDisabled: any;
    }) => any;
};
interface SelectProps {
    onChange?: (newVal: any) => void;
    isMulti?: boolean;
    sortOptions?: boolean;
    disabled?: boolean;
    isRequired?: boolean;
    value?: any;
    info?: any;
    wrapperClass?: string;
    error?: any;
    label?: string | ReactElement;
    options: any[];
    redInfo?: any;
    placeholder?: string;
    isClearable?: boolean;
    autoFocus?: boolean;
    groupedOptions?: boolean;
    isSingleClearable?: boolean;
    expandInputOnFocus?: boolean;
}
declare function Select(props: SelectProps): JSX.Element;
export default Select;
