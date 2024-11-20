import { FC } from 'react';
interface HourlySelectorProps {
    hourlyData: {
        hours: string;
        minuteOffset: string;
        days?: string;
    };
    onChange: (data: {
        hours: string;
        minuteOffset: string;
        days?: string;
    }) => void;
    isDisabled?: boolean;
}
declare const HourlySelector: FC<HourlySelectorProps>;
export default HourlySelector;
