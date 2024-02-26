/// <reference types="react" />
import { DateTime } from 'luxon';
import './DateSelector.scss';
interface DateSelectorProps {
    date: DateTime;
    onSubmit: (val?: any) => void;
    maxDate?: DateTime | null;
    minDate?: DateTime | null;
}
declare function DateSelector(props: DateSelectorProps): JSX.Element;
export default DateSelector;
