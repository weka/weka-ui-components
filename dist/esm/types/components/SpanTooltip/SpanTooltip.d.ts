/// <reference types="react" />
import './spanTooltip.scss';
interface SpanTooltipProps {
    children: number | string;
    extraClasses: string;
    style?: object;
}
declare function SpanTooltip({ children, extraClasses, style }: SpanTooltipProps): JSX.Element;
export default SpanTooltip;
