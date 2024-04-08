import React from 'react';
import './filterHeader.scss';
interface FilterHeaderProps {
    title?: string;
    setFilter: (val: any) => void;
    Filter: typeof React.Component;
    dataForFilter?: {
        [key: string]: any;
    };
    filterKey?: string;
}
declare function FilterHeader({ title, setFilter, Filter, dataForFilter, filterKey }: FilterHeaderProps): JSX.Element;
export default FilterHeader;
