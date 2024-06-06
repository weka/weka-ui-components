/// <reference types="react" />
import type { TooltipProps } from '../Tooltip';
import './spanTooltip.scss';
type SpanTooltipProps = {
    children: number | string;
    extraClasses?: string;
    style?: object;
} & Omit<TooltipProps, 'children' | 'data'>;
declare function SpanTooltip({ children, extraClasses, style, ...tooltipProps }: SpanTooltipProps): JSX.Element;
export default SpanTooltip;
