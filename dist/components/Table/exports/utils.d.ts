import { ColumnDef, ColumnHelper } from '@tanstack/react-table';
import { IconButtonCellOptions } from './cells';
export declare const createColumnHelperWithAction: <Data>() => ColumnHelper<Data> & {
    action: (actionDef: IconButtonCellOptions<Data>) => ColumnDef<Data, unknown>;
};
