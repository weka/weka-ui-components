import { ReactElement } from 'react';
import './loginField.scss';
interface LoginFieldProps {
    onChange: (newVal: any) => void;
    value?: any;
    isRequired?: boolean;
    wrapperClass?: string;
    placeholder?: string;
    label: string | ReactElement;
    type?: string;
    tooltip?: any;
    error?: any;
}
declare function LoginField(props: LoginFieldProps): JSX.Element;
export default LoginField;
