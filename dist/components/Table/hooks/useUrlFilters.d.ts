import { ExtendedColumnFilter, UrlFilterParser } from '../types';
import { urlFilterParsers } from '../tableUtils';

declare function useUrlFilters(props: {
    enabled?: boolean;
    filterConfig: {
        id: string;
        /**
         * If not provided stringParser will be used
         */
        filterParser?: UrlFilterParser | keyof typeof urlFilterParsers;
    }[];
    filterCategory: string;
}): [
    ExtendedColumnFilter[],
    (filters: ExtendedColumnFilter[] | ((prevState: ExtendedColumnFilter[]) => ExtendedColumnFilter[])) => void
];
export default useUrlFilters;
