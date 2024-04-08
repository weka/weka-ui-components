/// <reference types="react" />
import { ExtendedCell, ExtendedCellProps } from '../../../types';
export interface ApiCallCellOptions<Data, Value> {
    apiCall: (cell: ExtendedCell<Data, Value>) => Promise<string>;
    errorText: string;
}
export type ApiCallCellValue = never;
export declare const ApiCallCellName = "ApiCallCell";
declare function ApiCallCell<Data>(props: ExtendedCellProps<Data, ApiCallCellValue>): JSX.Element;
export default ApiCallCell;
