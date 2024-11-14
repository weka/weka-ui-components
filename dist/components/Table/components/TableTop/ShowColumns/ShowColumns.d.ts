import { default as React } from 'react';
import { ExtendedTable } from '../../../types';
interface ShowColumnsProps<Data> {
    table: ExtendedTable<Data>;
}
declare function ShowColumns<Data>(props: ShowColumnsProps<Data>): React.JSX.Element;
export default ShowColumns;
