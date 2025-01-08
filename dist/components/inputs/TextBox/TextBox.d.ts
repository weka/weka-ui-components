import { default as React, ReactElement } from 'react';
interface TextBoxProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    placeholder?: string | number;
    label?: string | ReactElement;
    tooltip?: string | ReactElement;
    error?: any;
    Icon?: ReactElement;
    type?: string;
    isRequired?: boolean;
    info?: any;
    allowDecimal?: boolean;
    allowNegative?: boolean;
    autosize?: boolean;
    maxLength?: number;
    autofill?: boolean;
    getAsyncDefaultValue?: () => Promise<string>;
}
declare const TextBox: React.ForwardRefExoticComponent<TextBoxProps & React.RefAttributes<unknown>>;
export default TextBox;
