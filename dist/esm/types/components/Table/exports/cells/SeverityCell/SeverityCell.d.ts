/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
import './severityCell.scss';
export type SeverityCellValue = string;
declare function SeverityCell<Data>(props: ExtendedCellProps<Data, SeverityCellValue>): JSX.Element;
export default SeverityCell;
