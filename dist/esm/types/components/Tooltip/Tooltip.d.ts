import { ReactElement } from 'react';
import './tooltip.scss';
interface TooltipProps {
    children: ReactElement;
    clear?: boolean;
    data?: ReactElement | string;
    extraClass?: string;
    [key: string]: any;
}
declare function Tooltip({ children, clear, data, extraClass, ...rest }: TooltipProps): JSX.Element;
export default Tooltip;
