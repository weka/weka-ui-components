import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlIpBoxProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string;
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlIpBox(props: ControlIpBoxProps): React.JSX.Element;
export default ControlIpBox;
