import { ReactElement } from 'react';
import './filterWrapper.scss';
interface FilterWrapperProps {
    setFilter: (value: any) => void;
    children: ReactElement;
    value?: any;
    columnTitle?: string;
}
declare function FilterWrapper({ setFilter, value, children, columnTitle }: FilterWrapperProps): JSX.Element;
export default FilterWrapper;
