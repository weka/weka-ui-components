/// <reference types="react" />
import './textField.scss';
interface TextFieldProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    error?: any;
    label: string;
    secondLabel?: string;
}
declare function TextField(props: TextFieldProps): JSX.Element;
export default TextField;
