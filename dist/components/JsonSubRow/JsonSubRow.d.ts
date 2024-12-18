import { default as React } from 'react';
import { Row } from '@tanstack/react-table';
interface JsonSubRowProps<Data> {
    row: Row<Data>;
}
declare function JsonSubRow<Data>({ row }: JsonSubRowProps<Data>): React.JSX.Element;
export default JsonSubRow;
