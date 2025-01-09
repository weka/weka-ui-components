import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export type CopyCellValue = string | undefined;
export declare const CopyCellName = "CopyCell";
export interface CopyCellOptions<Data> {
    isLoading?: boolean | ((values: Data) => boolean);
}
declare function CopyCell<Data>(props: ExtendedCellProps<Data, CopyCellValue>): React.JSX.Element;
export default CopyCell;
