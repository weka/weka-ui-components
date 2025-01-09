import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlTextBoxProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue?: string | number;
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlTextBox(props: ControlTextBoxProps): React.JSX.Element;
export default ControlTextBox;
