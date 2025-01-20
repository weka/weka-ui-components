import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlJsonProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string;
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlJson(props: ControlJsonProps): React.JSX.Element;
export default ControlJson;
