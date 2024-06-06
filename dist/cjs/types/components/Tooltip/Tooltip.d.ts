import { ReactElement } from 'react';
import type { TooltipProps as MuiTooltipProps } from '@mui/material';
import './tooltip.scss';
export type TooltipProps = {
    children: ReactElement;
    clear?: boolean;
    data?: ReactElement | string;
    extraClass?: string;
    extraPopperClass?: string;
} & Pick<MuiTooltipProps, 'open' | 'onClose' | 'onOpen'>;
declare function Tooltip({ children, clear, data, extraClass, extraPopperClass, ...rest }: TooltipProps): JSX.Element;
export default Tooltip;
