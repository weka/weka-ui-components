import { ExtendedColumnFilter, ExtendedTable } from '../types';

/**
 * Listens for custom DOM events that add or remove filters
 */
declare function useExplicitlyRemovedFilters<Data>({ columnFilters, table, listenerPrefix }: {
    columnFilters: ExtendedColumnFilter[];
    table: ExtendedTable<Data>;
    listenerPrefix?: string;
}): void;
export default useExplicitlyRemovedFilters;
