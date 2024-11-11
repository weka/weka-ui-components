import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export type TimeCellValue = number;
declare function TimeCell<Data>(props: ExtendedCellProps<Data, TimeCellValue>): React.JSX.Element;
export default TimeCell;
