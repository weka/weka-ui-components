/// <reference types="react" />
import { ExtendedCell, ExtendedCellProps } from '../../../types';
import './defaultCell.scss';
export interface DefaultCellOptions<Data, Value> {
    getUrl?: (values: Data) => string;
    openInNewTab?: boolean;
    tooltipText?: string | ((cell: ExtendedCell<Data, Value>) => string);
}
export type DefaultCellValue = string | number | string[] | null | undefined;
export declare const DefaultCellName = "DefaultCell";
declare function DefaultCell<Data>(props: ExtendedCellProps<Data, DefaultCellValue>): JSX.Element;
export default DefaultCell;
