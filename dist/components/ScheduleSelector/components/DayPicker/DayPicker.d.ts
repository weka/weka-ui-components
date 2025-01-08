import { default as React } from 'react';
import { Option } from '../../../ToggleButton/ToggleButton';
interface DayPickerProps {
    days: string;
    onChange: (days: string) => void;
    options?: Option[];
    isDisabled?: boolean;
    breakpointIndex?: number;
}
declare const DayPicker: ({ days, onChange, options, isDisabled, breakpointIndex }: DayPickerProps) => React.JSX.Element;
export default DayPicker;
