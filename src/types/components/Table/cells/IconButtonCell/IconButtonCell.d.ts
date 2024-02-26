/// <reference types="react" />
import { CustomRowAction, ExtendedRow } from '../../Table';
import './iconButtonCell.scss';
interface IconButtonCellProps {
    action: CustomRowAction;
    row: ExtendedRow<object>;
}
declare function IconButtonCell({ row, action }: IconButtonCellProps): JSX.Element;
export default IconButtonCell;
