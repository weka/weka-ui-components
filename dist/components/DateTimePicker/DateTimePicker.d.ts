import { DateTime } from 'luxon';

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
    canClear?: boolean;
    showNow?: boolean;
    enableCustomFormat?: boolean;
    customFormat?: string;
}
declare function DateTimePicker(props: DateTimePickerProps): JSX.Element;
export default DateTimePicker;
