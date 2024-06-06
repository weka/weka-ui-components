import React from 'react';
import { ExtendedCellProps } from '../../../types';
import './iconButtonCell.scss';
export interface IconButtonCellOptions<Data> {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean | ((rowValues: Data) => boolean);
    onClick: ((rowValues: Data) => void) | (() => void);
    tooltipText?: string | ((rowValues: Data) => string);
    extraClass?: string;
}
export declare const IconButtonCellName = "IconButtonCell";
declare function IconButtonCell<Data>(props: ExtendedCellProps<Data, unknown>): JSX.Element;
export default IconButtonCell;
