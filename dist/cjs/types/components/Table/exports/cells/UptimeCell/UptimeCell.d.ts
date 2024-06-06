/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
type UptimeCellValue = string;
declare function UptimeCell<Data>({ cell }: ExtendedCellProps<Data, UptimeCellValue>): JSX.Element;
export default UptimeCell;
