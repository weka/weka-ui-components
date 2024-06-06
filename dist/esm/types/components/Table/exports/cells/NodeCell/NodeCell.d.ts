/// <reference types="react" />
import './nodeCell.scss';
import { ExtendedCellProps } from '../../../types';
export type NodeCellValue = {
    nid: string;
    isBackend: boolean;
    roles?: string[];
};
declare function NodeCell<Data>(props: ExtendedCellProps<Data, NodeCellValue>): JSX.Element;
export default NodeCell;
