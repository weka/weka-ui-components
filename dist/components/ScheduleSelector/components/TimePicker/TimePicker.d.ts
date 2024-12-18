import { default as React } from 'react';
interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    isDisabled?: boolean;
}
declare const TimePicker: React.FC<TimePickerProps>;
export default TimePicker;
