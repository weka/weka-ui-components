import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlIpRangeBoxProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string;
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlIpRangeBox(props: ControlIpRangeBoxProps): React.JSX.Element;
export default ControlIpRangeBox;
