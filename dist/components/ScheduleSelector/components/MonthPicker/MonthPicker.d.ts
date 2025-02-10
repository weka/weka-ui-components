import { FC } from 'react';
interface MonthPickerProps {
    months: string;
    onChange: (time: string) => void;
    isDisabled?: boolean;
}
declare const MonthPicker: FC<MonthPickerProps>;
export default MonthPicker;
