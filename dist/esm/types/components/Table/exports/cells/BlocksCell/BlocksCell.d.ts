/// <reference types="react" />
import './blocksCell.scss';
import { ExtendedCellProps } from '../../../types';
export interface BlocksCellOptions<Data> {
    showTotalCountOnly?: boolean;
    isLink?: boolean;
    getUrl?: (values: Data) => string;
    openInNewTab?: boolean;
}
export type BlocksCellValue = {
    uid: string;
    id: string;
    status: string;
}[];
export declare const BlocksCellName = "BlocksCell";
declare function BlocksCell<Data>(props: ExtendedCellProps<Data, BlocksCellValue>): JSX.Element;
export default BlocksCell;
