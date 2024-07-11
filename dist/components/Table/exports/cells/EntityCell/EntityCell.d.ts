import { ExtendedCellProps } from '../../../types';

export type EntityCellValue = string;
declare function EntityCell<Data>(props: ExtendedCellProps<Data, EntityCellValue>): JSX.Element;
export default EntityCell;
