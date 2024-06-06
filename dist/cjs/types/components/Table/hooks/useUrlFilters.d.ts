import { ExtendedColumnFilter, UrlFilterParser } from '../types';
declare function useUrlFilters(props: {
    enabled?: boolean;
    filterConfig: {
        id: string;
        /**
         * If not provided stringParser will be used
         */
        filterParser?: UrlFilterParser;
    }[];
    filterCategory: string;
}): [
    ExtendedColumnFilter[],
    (filters: ExtendedColumnFilter[] | ((prevState: ExtendedColumnFilter[]) => ExtendedColumnFilter[])) => void
];
export default useUrlFilters;
