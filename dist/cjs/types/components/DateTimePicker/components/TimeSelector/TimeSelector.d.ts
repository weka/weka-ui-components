/// <reference types="react" />
import { DateTime } from 'luxon';
import './TimeSelector.scss';
interface TimeSelectorProps {
    time: DateTime;
    onSubmit: (val?: any) => void;
    onNowSubmit: (val?: any) => void;
    showSeconds?: boolean;
}
declare function TimeSelector(props: TimeSelectorProps): JSX.Element;
export default TimeSelector;
