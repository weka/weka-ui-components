import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
type TieringValue = {
    mode: string;
    name: string;
    state: string;
    detachProgress: number | null;
};
export type TieringCellValue = TieringValue[];
declare function TieringCell<Data>(props: ExtendedCellProps<Data, TieringCellValue>): React.JSX.Element;
export default TieringCell;
