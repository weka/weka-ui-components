import React, { ReactElement } from 'react';
import './textBox.scss';
interface TextBoxProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    placeholder?: string | number;
    label: string | ReactElement;
    tooltip?: string | ReactElement;
    error?: any;
    Icon?: ReactElement;
    type?: string;
    isRequired?: boolean;
    info?: any;
    allowDecimal?: boolean;
}
declare const TextBox: React.ForwardRefExoticComponent<TextBoxProps & React.RefAttributes<unknown>>;
export default TextBox;
