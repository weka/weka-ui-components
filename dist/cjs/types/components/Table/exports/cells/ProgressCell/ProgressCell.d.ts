/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
type ProgressCellValue = {
    status: string;
    progress: string;
};
declare function ProgressCell<Data>({ cell }: ExtendedCellProps<Data, ProgressCellValue>): JSX.Element;
export default ProgressCell;
