import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlLoginFieldProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string;
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlLoginField(props: ControlLoginFieldProps): React.JSX.Element;
export default ControlLoginField;
