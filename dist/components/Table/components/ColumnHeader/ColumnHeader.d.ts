import { ExtendedHeaderGroup, ExtendedTable, RowAction } from '../../types';

interface HeaderGroupProps<Data> {
    headerGroup: ExtendedHeaderGroup<Data>;
    table: ExtendedTable<Data>;
    isExpandable?: boolean;
    rowActions?: RowAction<Data>[];
    hasEmptyActionsCell?: boolean;
    isResizable: boolean;
}
declare function ColumnHeader<Data>(props: HeaderGroupProps<Data>): JSX.Element;
export default ColumnHeader;
