import { DateTime } from 'luxon';

interface DateTimeCalendarProps {
    onSubmit: (val?: any) => void;
    initValue?: DateTime;
    minDate?: DateTime | null;
    maxDate?: DateTime | null;
    showSeconds?: boolean;
    showTime?: boolean;
    canClear?: boolean;
    showNow?: boolean;
}
declare function DateTimeCalendar({ onSubmit, initValue, minDate, maxDate, showSeconds, showTime, canClear, showNow }: DateTimeCalendarProps): JSX.Element;
export default DateTimeCalendar;
