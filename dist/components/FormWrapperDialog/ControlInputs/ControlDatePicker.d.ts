import { default as React } from 'react';
import { Control } from 'react-hook-form';
interface ControlDatePickerProps {
    control: Control<Record<string, unknown>[]>;
    name: string;
    defaultValue: string;
    rules?: Record<string, unknown>;
    disabled?: boolean;
}
declare function ControlDatePicker(props: ControlDatePickerProps): React.JSX.Element;
export default ControlDatePicker;
