import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export interface CapacityCellOptions {
    noDataLabel?: string;
}
export interface CapacityCellValue {
    used: number;
    total: number;
    isThin: boolean;
    maxThin: number;
    minThin: number;
    caution: boolean;
    base: number;
}
export declare const CapacityCellName = "CapacityCell";
declare function CapacityCell<Data>(props: ExtendedCellProps<Data, CapacityCellValue>): React.JSX.Element;
export default CapacityCell;
