/// <reference types="react" />
import { ExtendedCell, ExtendedCellProps } from '../../../types';
export interface ApiCallCellOptions<Data, Value> {
    apiCall: (cell: ExtendedCell<Data, Value>) => Promise<string>;
    errorText: string;
}
export declare const ApiCallCellName = "ApiCallCell";
declare function ApiCallCell<Data>(props: ExtendedCellProps<Data, unknown>): JSX.Element;
export default ApiCallCell;
