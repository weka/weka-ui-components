import { FC } from 'react';
interface PeriodicSelectorProps {
    periodicData: {
        days?: string;
        start_time?: string;
        end_time?: string;
        interval?: number;
    };
    onChange: (data: Record<string, any>) => void;
    isDisabled?: boolean;
}
declare const PeriodicSelector: FC<PeriodicSelectorProps>;
export default PeriodicSelector;
