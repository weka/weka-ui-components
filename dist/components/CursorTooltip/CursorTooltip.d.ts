import { default as React } from 'react';
import { default as Tooltip } from '../Tooltip';
export type CursorTooltipProps = {
    children: React.ReactElement;
    data?: React.ReactElement | string;
    extraClass?: string;
    extraPopperClass?: string;
    enterDelay?: number;
    disappearAfterTimeout?: number;
} & React.ComponentProps<typeof Tooltip>;
declare function CursorTooltip({ children, enterDelay, ...rest }: CursorTooltipProps): React.JSX.Element;
export default CursorTooltip;
