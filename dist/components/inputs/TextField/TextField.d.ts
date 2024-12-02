import { default as React } from 'react';
interface TextFieldProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    error?: any;
    label: string;
    secondLabel?: string;
}
declare function TextField(props: TextFieldProps): React.JSX.Element;
export default TextField;
