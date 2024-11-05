import { default as React } from 'react';
import { DateTime } from 'luxon';
interface DayCellProps {
    month: number;
    date: DateTime;
    selected: boolean;
    onSelect: (val?: any) => void;
    minDate?: DateTime | null;
    maxDate?: DateTime | null;
}
declare function DayCell(props: DayCellProps): React.JSX.Element;
export default DayCell;
