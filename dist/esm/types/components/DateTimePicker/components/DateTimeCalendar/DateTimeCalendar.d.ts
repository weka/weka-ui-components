/// <reference types="react" />
import { DateTime } from 'luxon';
import './dateTimeCalendar.scss';
interface DateTimeCalendarProps {
    onSubmit: (val?: any) => void;
    initValue?: DateTime;
    minDate?: DateTime | null;
    maxDate?: DateTime | null;
    showSeconds?: boolean;
    showTime?: boolean;
}
declare function DateTimeCalendar({ onSubmit, initValue, minDate, maxDate, showSeconds, showTime }: DateTimeCalendarProps): JSX.Element;
export default DateTimeCalendar;
