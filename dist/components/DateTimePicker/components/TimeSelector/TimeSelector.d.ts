import { DateTime } from 'luxon';
interface TimeSelectorProps {
    time: DateTime;
    onSubmit: (val?: any) => void;
    onNowSubmit: (val?: any) => void;
    showSeconds?: boolean;
    showNow?: boolean;
}
declare function TimeSelector(props: TimeSelectorProps): JSX.Element;
export default TimeSelector;
