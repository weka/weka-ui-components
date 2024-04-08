/// <reference types="react" />
import './tieringCell.scss';
import { ExtendedCellProps } from '../../../types';
type TieringValue = {
    mode: string;
    name: string;
    state: string;
    detachProgress: number | null;
};
export type TieringCellValue = TieringValue[];
declare function TieringCell<Data>(props: ExtendedCellProps<Data, TieringCellValue>): JSX.Element;
export default TieringCell;
