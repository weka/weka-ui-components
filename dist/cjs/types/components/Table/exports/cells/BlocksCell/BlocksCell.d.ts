/// <reference types="react" />
import './blocksCell.scss';
import { ExtendedCell, ExtendedCellProps } from '../../../types';
export interface BlocksCellOptions<Data, Value> {
    showTotalCountOnly?: boolean;
    isLink?: boolean;
    getUrl?: (cell: ExtendedCell<Data, Value>) => string;
    openInNewTab?: boolean;
}
type BlocksCellValue = {
    uid: string;
    id: string;
    status: string;
}[];
export declare const BlocksCellName = "BlocksCell";
declare function BlocksCell<Data>(props: ExtendedCellProps<Data, BlocksCellValue>): JSX.Element;
export default BlocksCell;
