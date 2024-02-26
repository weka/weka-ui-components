export interface UrlFilterParser {
    (rawValue: string[] | Record<string, string[]>): ExtendedFilter['value'] | null | void;
}
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
    ExtendedFilter[],
    (filters: ExtendedFilter[] | ((prevState: ExtendedFilter[]) => ExtendedFilter[])) => void
];
export default useUrlFilters;
