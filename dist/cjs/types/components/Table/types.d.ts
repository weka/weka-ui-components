import type { Column, ColumnDef, FilterFn, Table, HeaderGroup, Cell, Row, ColumnFilter } from '@tanstack/react-table';
import '@tanstack/react-table';
import { ApiCallCellOptions, BlocksCellOptions, CapacityCellOptions, DateCellOptions, DefaultCellOptions, IconCellOptions, SwitchCellOptions, StatusCellOptions, IconButtonCellOptions, ApiCallCellName, CapacityCellName, StatusCellName, DateCellName, SwitchCellName, IconCellName, DefaultCellName, IconButtonCellName, BlocksCellName } from './exports';
import { DateFilterOptions, FilterTypes, MultiSelectFilterOptions, SelectFilterOptions } from './components';
export type ExtendedTable<Data> = Table<Data>;
export type ExtendedColumnDef<Data, Value> = ColumnDef<Data, Value>;
export type ExtendedColumnDefWithId<Data, Value> = ExtendedColumnDef<Data, Value> & {
    id: string;
};
export type ExtendedColumn<Data, Value> = Column<Data, Value>;
export type ExtendedHeaderGroup<Data> = HeaderGroup<Data>;
export type ExtendedRow<Data> = Row<Data>;
export type ExtendedCell<Data, Value> = Cell<Data, Value>;
export interface ExtendedCellProps<Data, Value> {
    table: ExtendedTable<Data>;
    row: ExtendedRow<Data>;
    column: ExtendedColumn<Data, Value>;
    cell: ExtendedCell<Data, Value>;
    getValue: () => unknown;
    renderValue: () => unknown;
}
type FilterDef<Data, Type extends FilterTypes, FilterOptions = undefined> = Type | {
    type: Type;
    filterFn?: FilterFn<Data>;
    options?: FilterOptions;
};
type CellOptions<Type, Options> = {
    type: Type;
    options: Options;
};
type CellDef<TData, TValue, Type extends string | undefined, Options = undefined> = {
    onClick?: (cell: Cell<TData, TValue>) => void;
} & (CellOptions<never, never> | CellOptions<Type, Options>);
declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        defaultHidden?: boolean;
        headerTooltip?: string;
        filter?: FilterDef<TData, 'date', DateFilterOptions> | FilterDef<TData, 'multiSelect', MultiSelectFilterOptions> | FilterDef<TData, 'select', SelectFilterOptions> | FilterDef<TData, 'severity'> | FilterDef<TData, 'text'>;
        cell?: CellDef<TData, TValue, typeof ApiCallCellName, ApiCallCellOptions<TData, TValue>> | CellDef<TData, TValue, typeof CapacityCellName, CapacityCellOptions> | CellDef<TData, TValue, typeof StatusCellName, StatusCellOptions<TData>> | CellDef<TData, TValue, typeof BlocksCellName, BlocksCellOptions<TData, TValue>> | CellDef<TData, TValue, typeof DateCellName, DateCellOptions> | CellDef<TData, TValue, typeof SwitchCellName, SwitchCellOptions<TData>> | CellDef<TData, TValue, typeof IconCellName, IconCellOptions<TData>> | CellDef<TData, TValue, typeof DefaultCellName, DefaultCellOptions<TData, TValue>> | CellDef<TData, TValue, typeof IconButtonCellName, IconButtonCellOptions<TData>>;
        columnTitle?: string;
    }
}
export type BaseFilterProps<Data, Value> = {
    column: ExtendedColumn<Data, Value>;
};
export type ExtendedFilterProps<Data, Value, FilterOptions = unknown> = BaseFilterProps<Data, Value> & {
    filterOptions: FilterOptions;
};
export interface UrlFilterParser {
    (rawValue: string[] | Record<string, string[]>): unknown;
}
export interface TableExtraClasses {
    tableWrapper?: string;
    tableLine?: string;
    expandCell?: string;
    tableCell?: string;
}
export interface RowAction<Data> {
    hideAction: boolean | ((rowValues: Data) => boolean);
    action?: ((rowValues: Data) => void) | (() => void);
    content?: string | ((rowValues: Data) => HTMLElement);
    disabled?: boolean | ((rowValues: Data) => boolean);
    text?: string;
}
export type ExtendedColumnFilter = ColumnFilter & {
    defaultFilter?: boolean;
};
export {};
