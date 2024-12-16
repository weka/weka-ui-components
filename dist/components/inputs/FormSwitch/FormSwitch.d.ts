import { default as React } from 'react';
interface FormSwitchProps {
    label: string;
    info?: string;
    onChange: (newValue: any) => void;
    oneColor?: boolean;
    disabled?: boolean;
    value?: boolean;
    placeholder?: boolean;
    redInfo?: (value?: boolean) => string;
    [key: string]: any;
}
declare function FormSwitch({ onChange, oneColor, value, label, placeholder, isRequired, info, redInfo, ...rest }: FormSwitchProps): React.JSX.Element;
export default FormSwitch;
