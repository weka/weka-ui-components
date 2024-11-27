import { FC } from 'react';
interface MonthlySelectorProps {
    monthlyData: {
        months: string;
        time: string;
        days: string;
    };
    onChange: (data: {
        months: string;
        time: string;
        days: string;
    }) => void;
    isDisabled?: boolean;
}
declare const MonthlySelector: FC<MonthlySelectorProps>;
export default MonthlySelector;
