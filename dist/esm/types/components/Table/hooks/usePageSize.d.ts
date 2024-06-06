/// <reference types="react" />
import { ExtendedTable } from '../types';
declare function usePageSize<Data>({ table, tableRef, miniTable, fixedPageSize, data }: {
    table: ExtendedTable<Data>;
    tableRef: React.RefObject<HTMLDivElement>;
    miniTable?: boolean;
    fixedPageSize: number | undefined;
    data: Data[];
}): void;
export default usePageSize;
