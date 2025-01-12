import { default as React } from 'react';
import { DateTime } from 'luxon';
interface DateSelectorProps {
    date: DateTime;
    onSubmit: (val?: any) => void;
    maxDate?: DateTime | null;
    minDate?: DateTime | null;
}
declare function DateSelector(props: DateSelectorProps): React.JSX.Element;
export default DateSelector;
