import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export type EntityCellValue = string;
declare function EntityCell<Data>(props: ExtendedCellProps<Data, EntityCellValue>): React.JSX.Element;
export default EntityCell;
