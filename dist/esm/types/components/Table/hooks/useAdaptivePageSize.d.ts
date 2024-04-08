/// <reference types="react" />
import { ExtendedRow, ExtendedTable } from '../types';
declare function useAdaptivePageSize<Data>({ table, tableRef, miniTable, fixedPageSize, rows }: {
    table: ExtendedTable<Data>;
    tableRef: React.RefObject<HTMLDivElement>;
    miniTable?: boolean;
    fixedPageSize: number | undefined;
    rows: ExtendedRow<Data>[];
}): void;
export default useAdaptivePageSize;
