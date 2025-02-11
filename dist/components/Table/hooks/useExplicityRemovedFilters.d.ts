import { ExtendedColumnFilter } from '../types';
/**
 * Keeps track of user-removed **default** filters
 */
declare function useExplicitlyRemovedFilters(initialUserFilters?: ExtendedColumnFilter[]): readonly [Set<string>, (filters: ExtendedColumnFilter[]) => void];
export default useExplicitlyRemovedFilters;
