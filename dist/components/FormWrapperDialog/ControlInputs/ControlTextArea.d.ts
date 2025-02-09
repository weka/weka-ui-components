import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlTextAreaProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string;
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlTextArea(props: ControlTextAreaProps): React.JSX.Element;
export default ControlTextArea;
