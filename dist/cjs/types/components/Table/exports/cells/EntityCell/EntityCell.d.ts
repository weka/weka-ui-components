/// <reference types="react" />
import { ExtendedCellProps } from '../../../types';
import './entityCell.scss';
type EntityCellValue = string;
declare function EntityCell<Data>({ cell }: ExtendedCellProps<Data, EntityCellValue>): JSX.Element;
export default EntityCell;
