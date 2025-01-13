import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlSwitchProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: boolean;
    rules?: Record<string, unknown>;
    onChange?: (value: boolean) => void;
    extraClass?: string;
}
declare function ControlSwitch(props: ControlSwitchProps): React.JSX.Element;
export default ControlSwitch;
