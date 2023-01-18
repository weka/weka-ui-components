/// <reference types="react" />
import { CellProps, UseRowStateCellProps, UseRowStateLocalState } from 'react-table';
interface ExtendedCellProps<T extends object> extends CellProps<T>, UseRowStateCellProps<T> {
    state: UseRowStateLocalState<T>;
}
interface ApiCallCellProps {
    cell: ExtendedCellProps<object>;
}
declare function ApiCallCell({ cell }: ApiCallCellProps): JSX.Element;
export default ApiCallCell;
