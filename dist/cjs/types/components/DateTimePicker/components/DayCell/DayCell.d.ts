/// <reference types="react" />
import { DateTime } from 'luxon';
import './DayCell.scss';
interface DayCellProps {
    month: number;
    date: DateTime;
    selected: boolean;
    onSelect: (val?: any) => void;
    minDate?: DateTime | null;
    maxDate?: DateTime | null;
}
declare function DayCell(props: DayCellProps): JSX.Element;
export default DayCell;
