/// <reference types="react" />
import { ExtendedRow, RowAction } from '../../Table';
import './actionsCell.scss';
interface ActionsCellProps {
    actions: Array<RowAction>;
    row: ExtendedRow<object>;
    disablePortal?: boolean;
}
declare function ActionsCell({ actions, row, disablePortal }: ActionsCellProps): JSX.Element;
export default ActionsCell;
