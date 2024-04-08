/// <reference types="react" />
import { ExtendedTable } from '../../../types';
import './showColumns.scss';
interface ShowColumnsProps<Data> {
    table: ExtendedTable<Data>;
}
declare function ShowColumns<Data>(props: ShowColumnsProps<Data>): JSX.Element;
export default ShowColumns;
