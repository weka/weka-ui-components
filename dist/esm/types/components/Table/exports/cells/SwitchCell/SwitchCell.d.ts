/// <reference types="react" />
import './switchCell.scss';
import { ExtendedCellProps, ExtendedRow } from '../../../types';
export interface SwitchCellOptions<Data> {
    onChange: (row: ExtendedRow<Data>) => void;
    tooltipText?: string | ((value: boolean) => string);
}
export type SwitchCellValue = boolean;
export declare const SwitchCellName = "SwitchCell";
declare function SwitchCell<Data>(props: ExtendedCellProps<Data, SwitchCellValue>): JSX.Element;
export default SwitchCell;
