import { default as React } from 'react';
interface RadioSwitchProps {
    label: string;
    value: string;
    checked: boolean;
    onChange: (newVal: any) => void;
    disabled?: boolean;
    info?: string;
}
declare function RadioSwitch({ label, checked, onChange, value, disabled, info }: RadioSwitchProps): React.JSX.Element;
export default RadioSwitch;