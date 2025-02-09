import { default as React, ReactElement } from 'react';
interface LoginFieldProps {
    onChange: (newVal: string | number) => void;
    value?: string | number;
    isRequired?: boolean;
    wrapperClass?: string;
    placeholder?: string;
    label: string | ReactElement;
    type?: string;
    tooltip?: any;
    error?: any;
}
declare function LoginField(props: LoginFieldProps): React.JSX.Element;
export default LoginField;
