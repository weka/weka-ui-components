import { ExtendedRow, RowAction } from '../../types';
interface ActionsCellProps<Data> {
    actions: RowAction<Data>[];
    row: ExtendedRow<Data>;
    disablePortal?: boolean;
}
declare function ActionsCell<Data>(props: ActionsCellProps<Data>): JSX.Element;
export default ActionsCell;
