import { default as React } from 'react';
import { ExtendedCellProps } from '../../../types';
export interface IconButtonCellOptions<Data> {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean | ((rowValues: Data) => boolean);
    onClick: ((rowValues: Data) => void) | (() => void);
    tooltipText?: string | ((rowValues: Data) => string);
    extraClass?: string;
}
export type IconButtonCellValue = never;
export declare const IconButtonCellName = "IconButtonCell";
declare function IconButtonCell<Data>(props: ExtendedCellProps<Data, IconButtonCellValue>): React.JSX.Element;
export default IconButtonCell;
