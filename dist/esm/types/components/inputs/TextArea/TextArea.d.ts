import { ReactElement } from 'react';
import './textArea.scss';
interface TextAreaProps {
    onChange?: (newVal: any) => void;
    value?: any;
    wrapperClass?: string;
    info?: string;
    isRequired?: boolean;
    placeholder?: string | number;
    label: string | ReactElement;
    error?: any;
}
declare const TextArea: (props: TextAreaProps) => JSX.Element;
export default TextArea;
