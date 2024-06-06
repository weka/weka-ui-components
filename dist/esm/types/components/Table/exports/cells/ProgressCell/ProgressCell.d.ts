/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
export type ProgressCellValue = {
    status: string;
    progress: string;
};
declare function ProgressCell<Data>(props: ExtendedCellProps<Data, ProgressCellValue>): JSX.Element;
export default ProgressCell;
