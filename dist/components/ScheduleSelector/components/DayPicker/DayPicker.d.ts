import { default as React } from 'react';
import { Option } from '../../../ToggleButton/ToggleButton';
interface DayPickerProps {
    days: string;
    onChange: (days: string) => void;
    options?: Option[];
    isDisabled?: boolean;
}
declare const DayPicker: ({ days, onChange, options, isDisabled }: DayPickerProps) => React.JSX.Element;
export default DayPicker;
