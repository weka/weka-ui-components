export declare const useUrlFilters: ({ enabled, filterIds, initial, filterCategory }: {
    enabled?: boolean | undefined;
    filterIds: string[];
    initial?: Filter[] | undefined;
    filterCategory: string;
}) => readonly [Filter[], (filters: Filter[]) => void];
