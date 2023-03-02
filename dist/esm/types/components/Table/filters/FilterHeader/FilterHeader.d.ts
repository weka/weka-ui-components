import { ReactElement } from 'react';
import './filterHeader.scss';
interface FilterHeaderProps {
    title?: string;
    filterKey?: string;
    Filter: ReactElement;
    dataForFilter?: any;
    setFilter: (value: any) => void;
}
declare function FilterHeader({ title, setFilter, Filter, dataForFilter, filterKey }: FilterHeaderProps): JSX.Element;
export default FilterHeader;
