/// <reference types="react" />
import { ExtendedCellProps } from '../../../../Table/types';
export type TimeCellValue = number;
declare function TimeCell<Data>(props: ExtendedCellProps<Data, TimeCellValue>): JSX.Element;
export default TimeCell;
