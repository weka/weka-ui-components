/// <reference types="react" />
import { ExtendedCellProps } from '../../../../Table/types';
type TimeCellValue = number;
declare function TimeCell<Data>({ cell }: ExtendedCellProps<Data, TimeCellValue>): JSX.Element;
export default TimeCell;
