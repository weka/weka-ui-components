/// <reference types="react" />
import './FormSwitch.scss';
interface FormSwitchProps {
    label: string;
    info?: string;
    onChange: (newValue: any) => void;
    oneColor?: boolean;
    disabled?: boolean;
    value?: boolean;
    placeholder?: boolean;
    [key: string]: any;
}
declare function FormSwitch({ onChange, oneColor, value, label, placeholder, isRequired, info, ...rest }: FormSwitchProps): JSX.Element;
export default FormSwitch;
