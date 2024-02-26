import { ReactElement } from 'react';
import './filterWrapper.scss';
interface FilterWrapperProps {
    setFilter: (value: any) => void;
    children: ReactElement;
    value?: any;
    columnTitle: string;
    hideWrapper?: boolean;
    isPopperOpen?: boolean;
    onTogglePopper?: () => void;
    shouldDisableBtn?: (val: any) => boolean;
    disabledBtnTooltip?: string;
}
declare function FilterWrapper({ setFilter, value, children, columnTitle, disabledBtnTooltip, hideWrapper, shouldDisableBtn, isPopperOpen: isPopperOpenOuter, onTogglePopper: onTogglePopperOuter }: FilterWrapperProps): JSX.Element;
export default FilterWrapper;
