/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
import './entityCell.scss';
export type EntityCellValue = string;
declare function EntityCell<Data>(props: ExtendedCellProps<Data, EntityCellValue>): JSX.Element;
export default EntityCell;
