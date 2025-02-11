import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export type SeverityCellValue = string;
interface SeverityCellProps<Data> extends ExtendedCellProps<Data, SeverityCellValue> {
    extraClass?: string;
}
declare function SeverityCell<Data>(props: SeverityCellProps<Data>): React.JSX.Element;
export default SeverityCell;
