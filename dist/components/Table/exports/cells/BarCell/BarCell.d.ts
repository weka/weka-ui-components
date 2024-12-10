import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export type BarCellValue = number;
declare function BarCell<Data>(props: ExtendedCellProps<Data, BarCellValue>): React.JSX.Element;
export default BarCell;
