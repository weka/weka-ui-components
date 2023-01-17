/// <reference types="react" />
import { ColumnInstance } from 'react-table';
import './showColumns.scss';
interface ExtendedColumn extends ColumnInstance {
    [key: string]: any;
}
interface ShowColumnsProps {
    columns: Array<ExtendedColumn>;
    colProperty: string;
}
declare function ShowColumns({ columns, colProperty }: ShowColumnsProps): JSX.Element;
export default ShowColumns;
