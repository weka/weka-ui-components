import { FC } from 'react';
interface DailySelectorProps {
    dailyData: {
        days: string;
        time: string;
    };
    onChange: (data: {
        days: string;
        time: string;
    }) => void;
    isDisabled?: boolean;
}
declare const DailySelector: FC<DailySelectorProps>;
export default DailySelector;
