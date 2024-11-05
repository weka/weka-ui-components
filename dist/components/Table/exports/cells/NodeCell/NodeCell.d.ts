import { ExtendedCellProps } from '../../../types';
export type NodeCellValue = {
    nid: string;
    isBackend: boolean;
    showIsBackend: boolean;
    roles?: string[];
};
declare function NodeCell<Data>(props: ExtendedCellProps<Data, NodeCellValue>): JSX.Element;
export default NodeCell;
