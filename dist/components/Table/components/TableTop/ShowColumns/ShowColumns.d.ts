import { ExtendedTable } from '../../../types';
interface ShowColumnsProps<Data> {
    table: ExtendedTable<Data>;
}
declare function ShowColumns<Data>(props: ShowColumnsProps<Data>): JSX.Element;
export default ShowColumns;
