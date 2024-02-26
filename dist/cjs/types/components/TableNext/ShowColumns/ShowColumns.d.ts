/// <reference types="react" />
import './showColumns.scss';
import { Table } from '@tanstack/react-table';
interface ShowColumnsProps<Values extends Record<string, unknown>> {
    tableInstance: Table<Values>;
    colProperty: string;
}
declare function ShowColumns<Values extends Record<string, unknown>>(props: ShowColumnsProps<Values>): JSX.Element;
export default ShowColumns;
