import { default as React } from 'react';
interface HourPickerProps {
    hours: string;
    minuteOffset: number;
    selectedHours: string[];
    onChange: (hours: string[]) => void;
    isDisabled?: boolean;
}
declare const HourPicker: React.FC<HourPickerProps>;
export default HourPicker;
