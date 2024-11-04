import { default as React } from 'react';
interface WeeklySelectorProps {
    weeklyData: {
        days: string;
        time: string;
    };
    onChange: (data: {
        days: string;
        time: string;
    }) => void;
    isDisabled?: boolean;
}
declare const WeeklySelector: React.FC<WeeklySelectorProps>;
export default WeeklySelector;
