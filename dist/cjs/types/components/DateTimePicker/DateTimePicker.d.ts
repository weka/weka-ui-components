/// <reference types="react" />
import { DateTime } from 'luxon';
import './DateTimePicker.scss';
interface DateTimePickerProps {
    onChange: (val?: any) => void;
    value?: any;
    label?: string;
    minDate?: DateTime;
    maxDate?: DateTime;
    showSeconds?: boolean;
    isRequired?: boolean;
    error?: any;
    disablePortal?: boolean;
    showCalendarIcon?: boolean;
    showTime?: boolean;
    disabled?: boolean;
}
declare function DateTimePicker(props: DateTimePickerProps): JSX.Element;
export default DateTimePicker;
