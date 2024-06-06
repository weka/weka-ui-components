/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
import './capacityCell.scss';
export interface CapacityCellOptions {
    noDataLabel?: string;
}
interface CapacityCellValue {
    used: number;
    total: number;
    isThin: boolean;
    maxThin: number;
    minThin: number;
    caution: boolean;
}
export declare const CapacityCellName = "CapacityCell";
declare function CapacityCell<Data>(props: ExtendedCellProps<Data, CapacityCellValue>): JSX.Element;
export default CapacityCell;
