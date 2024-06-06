/// <reference types="react" />
import './barCell.scss';
import { ExtendedCellProps } from '../../../types';
type BarCellValue = number;
declare function BarCell<Data>({ cell }: ExtendedCellProps<Data, BarCellValue>): JSX.Element;
export default BarCell;
