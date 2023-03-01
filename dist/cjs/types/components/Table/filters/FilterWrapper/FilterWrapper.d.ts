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
}
declare function FilterWrapper({ setFilter, value, children, columnTitle, hideWrapper, isPopperOpen: isPopperOpenOuter, onTogglePopper: onTogglePopperOuter }: FilterWrapperProps): JSX.Element;
export default FilterWrapper;
