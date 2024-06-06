/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
import './severityCell.scss';
type SeverityCellValue = string;
declare function SeverityCell<Data>(props: ExtendedCellProps<Data, SeverityCellValue>): JSX.Element;
export default SeverityCell;
