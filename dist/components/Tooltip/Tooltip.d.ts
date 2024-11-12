import { default as React, ReactElement } from 'react';
import { TooltipProps as MuiTooltipProps } from '@mui/material';
export type TooltipProps = {
    children: ReactElement;
    clear?: boolean;
    data?: ReactElement | string;
    extraClass?: string;
    extraPopperClass?: string;
} & Pick<MuiTooltipProps, 'open' | 'onClose' | 'onOpen'>;
declare function Tooltip({ children, clear, data, extraClass, extraPopperClass, ...rest }: TooltipProps): React.JSX.Element;
export default Tooltip;
