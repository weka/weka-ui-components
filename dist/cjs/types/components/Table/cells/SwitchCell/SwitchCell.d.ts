/// <reference types="react" />
import { CustomCellProps, ExtendedRow } from '../../Table';
import './switchCell.scss';
interface ExtendedCustomCellProps<Data extends Record<string, unknown>> extends CustomCellProps<Data> {
    row: ExtendedRow<object>;
}
declare function SwitchCell<Data extends Record<string, unknown>>({ cell, column, row }: ExtendedCustomCellProps<Data>): JSX.Element;
export default SwitchCell;
