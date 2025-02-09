import { default as React } from 'react';
import { TooltipProps } from '../Tooltip';
export type SpanTooltipProps = {
    children: number | string;
    extraClasses?: string;
    style?: object;
    additionalData?: string;
    isMultiLine?: boolean;
} & Omit<TooltipProps, 'children' | 'data'>;
declare function SpanTooltip({ children, extraClasses, style, additionalData, isMultiLine, ...tooltipProps }: SpanTooltipProps): React.JSX.Element;
export default SpanTooltip;
