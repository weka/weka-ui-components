import { OrderByFn, Row } from 'react-table';
import { Column } from '../Table';
declare function useRowGroups<Data extends Record<string, unknown>>(args: {
    sortedColumn?: string;
    groupRowsBy?: string[];
    columns: Column<Data>[];
}): {
    getGroupedRows: (rows: Row[], group: string) => Record<string, Row<{}>[]>;
    orderByFn: (rows: Row<Data>[], sortFns: OrderByFn<Data>[], directions: boolean[]) => Row<Data>[];
};
export default useRowGroups;
