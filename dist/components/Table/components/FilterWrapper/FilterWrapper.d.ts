import { default as React, ReactElement } from 'react';
import { ExtendedColumn } from '../../types';
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
declare function FilterWrapper<Data, Value>({ column, value, children, disabledBtnTooltip, hideWrapper, shouldDisableBtn, isPopperOpen: isPopperOpenOuter, onTogglePopper: onTogglePopperOuter }: FilterWrapperProps<Data, Value>): React.JSX.Element;
export default FilterWrapper;
