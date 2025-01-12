import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export type NodeCellValue = {
    nid: string;
    isBackend: boolean;
    showIsBackend: boolean;
    roles?: string[];
};
declare function NodeCell<Data>(props: ExtendedCellProps<Data, NodeCellValue>): React.JSX.Element;
export default NodeCell;
