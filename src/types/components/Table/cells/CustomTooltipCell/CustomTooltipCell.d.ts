/// <reference types="react" />
import { CellValue } from 'react-table';
interface CustomTooltipProps {
    value: CellValue;
    tooltipData?: string;
}
declare function CustomTooltipCell({ value, tooltipData }: CustomTooltipProps): JSX.Element;
export default CustomTooltipCell;
