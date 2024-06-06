/// <reference types="react" />
import './tieringCell.scss';
import { ExtendedCellProps } from '../../../types';
type TieringValue = {
    mode: string;
    name: string;
    state: string;
    detachProgress: number | null;
};
type TieringCellValue = TieringValue[];
declare function TieringCell<Data>({ cell }: ExtendedCellProps<Data, TieringCellValue>): JSX.Element;
export default TieringCell;
