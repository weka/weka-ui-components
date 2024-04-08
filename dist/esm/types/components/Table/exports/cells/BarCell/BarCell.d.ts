/// <reference types="react" />
import './barCell.scss';
import { ExtendedCellProps } from '../../../types';
export type BarCellValue = number;
declare function BarCell<Data>(props: ExtendedCellProps<Data, BarCellValue>): JSX.Element;
export default BarCell;
