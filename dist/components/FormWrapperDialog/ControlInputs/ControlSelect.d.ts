import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlSelectProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string | number | string[];
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlSelect(props: ControlSelectProps): React.JSX.Element;
export default ControlSelect;
