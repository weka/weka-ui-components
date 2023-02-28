import React from 'react';
import './filterHeader.scss';
interface FilterHeaderProps {
    title?: string;
    filterKey?: string | null;
    Filter: React.FC<Record<string, unknown> & {
        setFilter: (filter: any) => void;
    }>;
    dataForFilter?: Record<string, unknown>;
    setFilter: (filter: any) => void;
}
declare function FilterHeader({ title, setFilter, Filter, dataForFilter, filterKey }: FilterHeaderProps): JSX.Element;
export default FilterHeader;
