export interface UrlFilterParser {
    (rawValue: string[] | Record<string, string[]>): ExtendedFilter['value'] | null | void;
}
declare function useUrlFilters({ enabled, filterConfig, filterCategory }: {
    enabled?: boolean;
    filterConfig: {
        id: string;
        filterParser: UrlFilterParser;
    }[];
    filterCategory: string;
}): [
    ExtendedFilter[],
    (filters: ExtendedFilter[] | ((prevState: ExtendedFilter[]) => ExtendedFilter[])) => void
];
export default useUrlFilters;
