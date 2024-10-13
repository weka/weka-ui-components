import { TooltipProps } from '../Tooltip';
type SpanTooltipProps = {
    children: number | string;
    extraClasses?: string;
    style?: object;
    additionalData?: string;
} & Omit<TooltipProps, 'children' | 'data'>;
declare function SpanTooltip({ children, extraClasses, style, additionalData, ...tooltipProps }: SpanTooltipProps): JSX.Element;
export default SpanTooltip;