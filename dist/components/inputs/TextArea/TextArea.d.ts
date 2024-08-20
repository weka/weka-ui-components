import { ReactElement } from 'react';

export interface TextAreaProps {
    onChange?: (newVal: any) => void;
    value?: any;
    wrapperClass?: string;
    info?: string;
    isRequired?: boolean;
    placeholder?: string | number;
    label: string | ReactElement;
    error?: any;
    tooltip?: string;
    disabled?: boolean;
}
declare const TextArea: (props: TextAreaProps) => JSX.Element;
export default TextArea;
