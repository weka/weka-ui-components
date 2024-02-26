import { Filters } from 'react-table';
/**
 * Keeps track of user-removed **default** filters
 */
declare function useExplicitlyRemovedFilters(initialUserFilters?: Filters<object>): readonly [Set<string>, (filters: Filters<object>) => void];
export default useExplicitlyRemovedFilters;
