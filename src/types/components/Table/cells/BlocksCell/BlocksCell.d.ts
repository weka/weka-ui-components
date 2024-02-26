/// <reference types="react" />
import { CustomCellProps } from '../../Table';
import './blocksCell.scss';
declare function BlocksCell<Data extends Record<string, unknown>>({ cell, column }: CustomCellProps<Data>): JSX.Element;
export default BlocksCell;
