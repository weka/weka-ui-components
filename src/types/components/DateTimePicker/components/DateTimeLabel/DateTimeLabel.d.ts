/// <reference types="react" />
import { DateTime } from 'luxon';
import './DateTimeLabel.scss';
interface DateTimeLabelProps {
    date?: DateTime | null;
    showSeconds?: boolean;
    showTime?: boolean;
    disabled?: boolean;
    enableCustomFormat?: boolean;
    customFormat?: string;
}
declare function DateTimeLabel(props: DateTimeLabelProps): JSX.Element;
export default DateTimeLabel;
