import { ReactElement } from 'react';
interface CustomizableSelectProps {
    onChange?: (newVal: unknown) => void;
    sortOptions?: boolean;
    disabled?: boolean;
    isRequired?: boolean;
    value?: unknown;
    info?: string | ReactElement;
    wrapperClass?: string;
    error?: string;
    label?: string | ReactElement;
    options: Option[];
    redInfo?: (value: unknown) => string;
    placeholder?: string;
    isClearable?: boolean;
    autoFocus?: boolean;
    groupedOptions?: boolean;
    customValueValidation?: (val: string) => boolean;
    customValueError?: string;
    createLabel?: string;
    getAsyncOptions?: (optionsUrl?: string) => Promise<Option[]>;
    optionsUrl?: string;
    tooltip?: string | ReactElement;
    defaultValueIndex?: number;
    defaultValueKey?: string;
    preventCall?: boolean;
}
declare function CustomizableSelect(props: CustomizableSelectProps): JSX.Element;
export default CustomizableSelect;
