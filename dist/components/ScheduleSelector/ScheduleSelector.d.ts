import { FC } from 'react';
import { ScheduleData } from './types';
interface ScheduleSelectorProps {
    type: string;
    scheduleData: ScheduleData;
    onChange: (type: string, data: Record<string, string | number>) => void;
    isDisabled?: boolean;
    wrapperClass?: string;
}
declare const ScheduleSelector: FC<ScheduleSelectorProps>;
export default ScheduleSelector;
