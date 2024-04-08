import { ReactElement } from 'react';
import { ExtendedColumn } from '../../types';
import './filterWrapper.scss';
interface FilterWrapperProps<Data, Value> {
    column: ExtendedColumn<Data, Value>;
    value?: Value;
    children: ReactElement;
    hideWrapper?: boolean;
    isPopperOpen?: boolean;
    onTogglePopper?: () => void;
    shouldDisableBtn?: (val: any) => boolean;
    disabledBtnTooltip?: string;
}
declare function FilterWrapper<Data, Value>({ column, value, children, disabledBtnTooltip, hideWrapper, shouldDisableBtn, isPopperOpen: isPopperOpenOuter, onTogglePopper: onTogglePopperOuter }: FilterWrapperProps<Data, Value>): JSX.Element;
export default FilterWrapper;
