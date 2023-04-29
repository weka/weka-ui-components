/// <reference types="react" />
import React, { MouseEventHandler, ReactNode, ReactElement, InputHTMLAttributes } from 'react';
import { UseFiltersColumnProps, Column as Column$1, Row, CellProps, Filters, UseExpandedRowProps, UseRowStateRowProps, UseRowStateCellProps, UseRowStateLocalState, CellValue } from 'react-table';
import * as luxon from 'luxon';
import { DateTime } from 'luxon';

interface ButtonProps {
    children: any;
    disable?: boolean;
    small?: boolean;
    empty?: boolean;
    fullWidth?: boolean;
    isLoading?: boolean;
    extraClass?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    [key: string]: any;
}
declare function Button(props: ButtonProps): JSX.Element;

interface CapacityBarProps {
    firstUsage?: number;
    firstColor?: string;
    secondUsage?: number;
    secondColor?: string;
}
declare function CapacityBar(props: CapacityBarProps): JSX.Element;

interface CircularProgressProps {
    size?: number;
    progress?: number;
    trackColor?: string;
    indicatorWidth?: number;
    indicatorColor?: string;
    indicatorCap?: "round" | "inherit" | "butt" | "square";
}
declare function CircularProgress(props: CircularProgressProps): JSX.Element;

declare function CloseButton(): JSX.Element;

interface EmptyPageMessageProps {
    children: any;
}
declare function EmptyPageMessage({ children }: EmptyPageMessageProps): JSX.Element;

interface ErrorPageProps {
    error?: ReactNode | string;
}
declare function ErrorPage({ error }: ErrorPageProps): JSX.Element;

interface InfoProps {
    data: ReactElement | string;
}
declare function Info({ data }: InfoProps): JSX.Element;

declare function Checkbox(props: InputHTMLAttributes<HTMLInputElement>): JSX.Element;

interface DataInfoProps {
    label: string;
    value: string;
}
declare function DataInfo(props: DataInfoProps): JSX.Element;

interface FormSwitchProps {
    label: string;
    info?: string;
    onChange: (newValue: any) => void;
    oneColor?: boolean;
    disabled?: boolean;
    value?: boolean;
    placeholder?: boolean;
    [key: string]: any;
}
declare function FormSwitch({ onChange, oneColor, value, label, placeholder, isRequired, info, ...rest }: FormSwitchProps): JSX.Element;

declare type Subnet = {
    ip: string;
    mask: string;
};
interface IpRangeTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: any;
    subnet: Subnet;
    wrapperClass?: string;
    label: string;
    error: string;
    info?: string;
}
declare function IpRangeTextBox(props: IpRangeTextBoxProps): JSX.Element;

interface IpSubnetTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: string;
    wrapperClass?: string;
    label: string;
    error?: string;
    info?: string;
}
declare function IpSubnetTextBox(props: IpSubnetTextBoxProps): JSX.Element;

interface IpTextBoxProps {
    disabled?: boolean;
    isRequired?: boolean;
    onChange: (newVal: any) => void;
    value: string;
    wrapperClass?: string;
    label: string;
    error?: string;
    info?: string;
}
declare function IpTextBox(props: IpTextBoxProps): JSX.Element;

interface JsonBoxProps {
    value: string | undefined;
    wrapperClass?: string;
    label: string;
    error?: string;
    disabled?: boolean;
    isRequired?: boolean;
    info?: string;
}
declare function JsonBox(props: JsonBoxProps): JSX.Element;

interface LoginFieldProps {
    onChange: (newVal: string | number) => void;
    value?: string | number;
    isRequired?: boolean;
    wrapperClass?: string;
    placeholder?: string;
    label: string | ReactElement;
    type?: string;
    tooltip?: any;
    error?: any;
}
declare function LoginField(props: LoginFieldProps): JSX.Element;

interface RadioSwitchProps {
    label: string;
    value: string;
    checked: boolean;
    onChange: (newVal: any) => void;
    disabled?: boolean;
    info?: string;
}
declare function RadioSwitch({ label, checked, onChange, value, disabled, info }: RadioSwitchProps): JSX.Element;

interface SelectProps {
    onChange?: (newVal: any) => void;
    isMulti?: boolean;
    sortOptions?: boolean;
    disabled?: boolean;
    isRequired?: boolean;
    value?: any;
    info?: any;
    wrapperClass?: string;
    error?: any;
    label?: string | ReactElement;
    options: any[];
    redInfo?: any;
    placeholder?: string;
    isClearable?: boolean;
    autoFocus?: boolean;
    groupedOptions?: boolean;
    isSingleClearable?: boolean;
}
declare function Select(props: SelectProps): JSX.Element;

interface TagsBoxProps {
    onChange: (newVal: any) => void;
    value: any;
    wrapperClass?: string;
    warning?: string;
    isRequired?: boolean;
    tagsValidation?: (val: any) => boolean;
    placeholder?: string | number;
    label: string | ReactElement;
    error?: any;
    info?: any;
    invalidTagText?: string;
    disabled?: boolean;
    isClearable?: boolean;
}
declare function TagsBox(props: TagsBoxProps): JSX.Element;

interface TextAreaProps {
    onChange?: (newVal: any) => void;
    value?: any;
    wrapperClass?: string;
    info?: string;
    isRequired?: boolean;
    placeholder?: string | number;
    label: string | ReactElement;
    error?: any;
}
declare const TextArea: (props: TextAreaProps) => JSX.Element;

interface TextBoxProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    placeholder?: string | number;
    label?: string | ReactElement;
    tooltip?: string | ReactElement;
    error?: any;
    Icon?: ReactElement;
    type?: string;
    isRequired?: boolean;
    info?: any;
    allowDecimal?: boolean;
}
declare const TextBox: React.ForwardRefExoticComponent<TextBoxProps & React.RefAttributes<unknown>>;

interface TextFieldProps {
    onChange: (newVal: any) => void;
    value: string | number;
    wrapperClass?: string;
    error?: any;
    label: string;
    secondLabel?: string;
}
declare function TextField(props: TextFieldProps): JSX.Element;

interface TextSelectBoxProps {
    label: string;
    onChange: (newVal: any) => void;
    isRequired?: boolean;
    selectPlaceholder?: any;
    value?: any;
    wrapperClass?: string;
    error?: string;
    info?: string;
    options: any[];
    formatFunc: (val: any) => any;
}
declare function TextSelectBox(props: TextSelectBoxProps): JSX.Element;

interface UploadFieldProps {
    onChange: (newVal: any) => void;
    onReadError?: () => void;
    wrapperClass?: string;
    placeholder?: string;
    label: string;
    error?: string;
    disabled?: boolean;
}
declare function UploadField(props: UploadFieldProps): JSX.Element;

interface JsonEditorProps {
    onChange?: () => void;
    readOnly?: boolean;
    value?: string;
    onValidate?: () => void;
    extraClass?: string;
    [key: string]: any;
}
declare function JsonEditor(props: JsonEditorProps): JSX.Element;

declare function Loader(): JSX.Element;

declare type menuItem = {
    hideMenu?: boolean;
    key?: string;
    text?: string;
    disabled?: string;
    tooltip?: string;
    extraClass?: string;
    onClick: () => void;
    content?: any;
};
interface MenuPopperProps {
    open: boolean;
    onClickAway: () => void;
    items: menuItem[];
    anchorEl: HTMLElement | null;
    disablePortal?: boolean;
    extraPopperClass?: string;
}
declare function MenuPopper(props: MenuPopperProps): JSX.Element;
declare namespace MenuPopper {
    var defaultProps: {
        disablePortal: boolean;
    };
    var propTypes: {};
}

interface NewPasswordTooltipProps {
    passValue?: string;
}
declare function NewPasswordTooltip({ passValue }: NewPasswordTooltipProps): JSX.Element;

interface SpanTooltipProps {
    children: number | string;
    extraClasses?: string;
    style?: object;
}
declare function SpanTooltip({ children, extraClasses, style }: SpanTooltipProps): JSX.Element;

interface SwitchProps {
    onChange: (newValue: any) => void;
    disabled?: boolean;
    oneColor?: boolean;
    checked: boolean;
    tooltip?: string;
}
declare function Switch(props: SwitchProps): JSX.Element;

interface TabProps {
    title: ReactElement | string;
    active: boolean;
    disabled?: boolean;
    wrapperClass?: string;
    setActive: () => void;
    subComponent?: ReactElement | null;
    isSideTab?: boolean;
}
declare function Tab({ title, subComponent, active, setActive, wrapperClass, disabled, isSideTab }: TabProps): JSX.Element;

interface ToastProps {
    message: any;
    icon: any;
}
declare function Toast(props: ToastProps): JSX.Element;
declare namespace Toast {
    var propTypes: {};
}

declare type Option$1 = {
    label: string;
    value: string;
};
interface ToggleButtonProps {
    options: Option$1[];
    value: string;
    onChange: (newVal: any) => void;
}
declare function ToggleButton(props: ToggleButtonProps): JSX.Element;

interface TooltipProps {
    children: ReactElement;
    clear?: boolean;
    data?: ReactElement | string;
    extraClass?: string;
    [key: string]: any;
}
declare function Tooltip({ children, clear, data, extraClass, ...rest }: TooltipProps): JSX.Element;

interface ExtendedFiltersColumn$3<T extends object> extends UseFiltersColumnProps<T> {
    fixedOptions: Array<any>;
    Header: string;
    id?: string;
    [key: string]: any;
}
declare function SelectFilter({ column }: ExtendedFiltersColumn$3<object>): JSX.Element;

interface ExtendedFiltersColumn$2<T extends object> extends UseFiltersColumnProps<T> {
    fixedOptions: Array<any>;
    Header: string;
    id?: string;
    [key: string]: any;
}
declare function MultiSelectFilter({ column }: ExtendedFiltersColumn$2<object>): JSX.Element;

interface ExtendedFiltersColumn$1<T extends object> extends UseFiltersColumnProps<T> {
    Header: string;
    id?: string;
}
interface DateFilterProps {
    column: ExtendedFiltersColumn$1<object>;
}
declare function DateFilter({ column }: DateFilterProps): JSX.Element;

interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
    Header: string;
    [key: string]: any;
    byMinSeverity?: boolean;
}
declare function SeverityFilter({ column }: ExtendedFiltersColumn<object>): JSX.Element;

declare function TextFilter({ column }: {
    [key: string]: any;
}): JSX.Element;

interface UrlFilterParser {
    (rawValue: string[] | Record<string, string[]>): ExtendedFilter['value'] | null;
}
declare function useUrlFilters({ enabled, filterConfig, filterCategory }: {
    enabled?: boolean;
    filterConfig: {
        id: string;
        filterParser: UrlFilterParser;
    }[];
    filterCategory: string;
}): [
    ExtendedFilter[],
    (filters: ExtendedFilter[] | ((prevState: ExtendedFilter[]) => ExtendedFilter[])) => void
];

declare type FilterComponent = typeof DateFilter | typeof MultiSelectFilter | typeof SelectFilter | typeof SeverityFilter | typeof TextFilter;
interface RowAction {
    hideAction: boolean | ((original: object) => boolean);
    action?: ((original: object) => void) | (() => void);
    content?: string | ((original: object) => HTMLElement);
    disabled?: boolean | ((original: object) => boolean);
    text?: string;
}
interface CustomRowAction {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean | ((original: object) => boolean);
    onClick: ((original: object) => void) | (() => void);
    tooltipText?: any;
    extraClass?: string;
}
interface CustomCellProps<Data extends Record<string, unknown>> {
    cell: CellProps<Data>;
    column: Column<Data>;
}
declare type Column<Data extends Record<string, unknown>> = Omit<Column$1<Data>, 'Filter' | 'Cell' | 'id' | 'accessor'> & {
    onClickCell?: (values: Data) => void;
    Cell?: React.FC<CustomCellProps<Data>>;
    defaultHidden?: boolean;
    Filter?: FilterComponent;
    filter?: string | ((rows: Row<Data>[], columnIds: string[], filterValue: any) => Row<Data>[]);
    sortType?: 'number' | ((rowA: Row<Data>, rowB: Row<Data>, columnId: string, desc: boolean) => number);
} & ({
    id?: string;
    accessor: string;
} | {
    id: string;
    accessor: (originalRow: Data, rowIndex: number) => unknown;
});
interface ExtendedRow<T extends object> extends Row, UseExpandedRowProps<T>, UseRowStateRowProps<T> {
    subRows: Array<Row<any>>;
}
interface TableProps<Data extends Record<string, unknown>> {
    columns: Column<Data>[];
    data: Data[];
    filterCategory: string;
    title?: string;
    maxRows?: number;
    rowActions?: RowAction[];
    emptyMessage?: string;
    tableActions?: Array<ReactNode>;
    defaultSort?: string;
    globalFilter?: string | ((rows: Array<Row>) => Row[]);
    defaultGlobalFilter?: string;
    checkRowSelected?: (row: object) => boolean;
    checkRowHighlighted?: (row: object) => boolean;
    getRowId?: (originalRow: object, relativeIndex: number, parent?: Row<object> | undefined) => string;
    addFilterToUrl?: boolean;
    RowSubComponent?: React.FC<{
        row: any;
    }>;
    listenerPrefix?: string;
    onRowClick?: (row?: Row) => void;
    miniTable?: boolean;
    fixedPageSize?: number;
    disableActionsPortal?: boolean;
    colPropForShowColumns?: string;
    manualPagination?: boolean;
    itemsAmount?: number;
    canExpandAll?: boolean;
    loading?: boolean;
    onFiltersChanged?: (newFilters: Filters<object>) => void;
    defaultDescendingSort?: boolean;
    customRowActions?: CustomRowAction[];
    manualFilters?: boolean;
    initialFilters?: Filter[];
    extraClasses?: {
        tableWrapper?: string;
        tableLine?: string;
        expandCell?: string;
        tableCell?: string;
    };
}
declare function Table<Values extends Record<string, unknown>>({ columns, data, rowActions, tableActions, title, defaultSort, globalFilter, defaultGlobalFilter, checkRowSelected, checkRowHighlighted, getRowId, addFilterToUrl, RowSubComponent, listenerPrefix, onRowClick, miniTable, filterCategory, fixedPageSize, disableActionsPortal, maxRows, emptyMessage, colPropForShowColumns, manualPagination, itemsAmount, canExpandAll, loading, onFiltersChanged, defaultDescendingSort, customRowActions, manualFilters, extraClasses, initialFilters: initialUserFilters }: TableProps<Values>): JSX.Element;

interface ActionsCellProps {
    actions: Array<RowAction>;
    row: ExtendedRow<object>;
    disablePortal?: boolean;
}
declare function ActionsCell({ actions, row, disablePortal }: ActionsCellProps): JSX.Element;

interface ExtendedCellProps<T extends object> extends CellProps<T>, UseRowStateCellProps<T> {
    state: UseRowStateLocalState<T>;
}
interface ApiCallCellProps {
    cell: ExtendedCellProps<object>;
}
declare function ApiCallCell({ cell }: ApiCallCellProps): JSX.Element;

declare function BarCell({ cell }: CustomCellProps): JSX.Element;

declare function BlocksCell<Data extends Record<string, unknown>>({ cell, column }: CustomCellProps<Data>): JSX.Element;

declare function CapacityCell({ cell }: CustomCellProps): JSX.Element;

interface CustomTooltipProps {
    value: CellValue;
    tooltipData?: string;
}
declare function CustomTooltipCell({ value, tooltipData }: CustomTooltipProps): JSX.Element;

declare function IconCell({ cell }: CustomCellProps): JSX.Element;

declare function StatusCell({ cell }: CustomCellProps): JSX.Element;

declare function ProgressCell({ cell }: CustomCellProps): JSX.Element;

declare function TieringCell({ cell }: CustomCellProps): JSX.Element;

declare function TimeCell({ cell }: CustomCellProps): JSX.Element;

declare function UptimeCell({ cell }: CustomCellProps): JSX.Element;

declare function SeverityCell({ cell }: CustomCellProps): JSX.Element;

declare function DateCell({ cell, column }: {
    cell: CellProps<object>;
    column: {
        [key: string]: any;
    };
}): JSX.Element;

declare function NodeCell({ cell }: CustomCellProps): JSX.Element;

declare function MultilineCell({ cell }: CustomCellProps): JSX.Element;

interface IconButtonCellProps {
    action: CustomRowAction;
    row: ExtendedRow<object>;
}
declare function IconButtonCell({ row, action }: IconButtonCellProps): JSX.Element;

interface DateTimePickerProps {
    onChange: (val?: any) => void;
    value?: any;
    label?: string;
    minDate?: DateTime;
    maxDate?: DateTime;
    showSeconds?: boolean;
    isRequired?: boolean;
    error?: any;
    disablePortal?: boolean;
    showCalendarIcon?: boolean;
    showTime?: boolean;
    disabled?: boolean;
    canClear?: boolean;
    showNow?: boolean;
}
declare function DateTimePicker(props: DateTimePickerProps): JSX.Element;

interface NumInputProps {
    max: number;
    value: number;
    onChange?: (val?: number) => void;
    numTitle?: string;
    numFocus?: {
        [key: string]: any;
    };
    setNumFocus?: (state: {
        [key: string]: any;
    }) => void;
    initialNumState?: {
        [key: string]: any;
    };
}
declare function NumInput(props: NumInputProps): JSX.Element;

interface PaginationProps {
    onPageChange: (page: number) => void;
    totalRows: number;
    rowsPerPage: number;
    defaultCurrentPage: number;
}
declare function Pagination({ onPageChange, totalRows, rowsPerPage, defaultCurrentPage }: PaginationProps): JSX.Element | null;

interface PerPageProps {
    value: string | number;
    onChange: (val: string | number) => void;
    options?: Option[];
}
declare function PerPage({ value, onChange, options }: PerPageProps): JSX.Element;

interface FilterButtonProps {
    onClick: () => void;
    disable?: boolean;
    extraClass?: string;
    tooltipText?: string;
}
declare function FilterButton({ onClick, disable, extraClass, tooltipText }: FilterButtonProps): JSX.Element;

interface FilterHeaderProps {
    title?: string;
    setFilter: (val: any) => void;
    Filter: typeof React.Component;
    dataForFilter?: {
        [key: string]: any;
    };
    filterKey?: string;
}
declare function FilterHeader({ title, setFilter, Filter, dataForFilter, filterKey }: FilterHeaderProps): JSX.Element;

interface FilterBoxProps {
    name: string;
    value: string | Array<string> | Record<string, unknown>;
    onDelete: () => void;
}
declare function FilterBox({ name, value: value, onDelete }: FilterBoxProps): JSX.Element;

declare function EntityCell({ cell }: CustomCellProps): JSX.Element;

declare const utils: {
    insensitiveSort: typeof insensitiveSort;
    isEllipsisActive(element: HTMLElement): boolean;
    getPasswordIcon(showPassword: boolean, toggleShowPassword: () => void): React.ReactElement;
    goToNextInput(): void;
    goToPreviousInput(): void;
    subnet2MaskOp(subnet: string): string;
    formatOption(label: string, value?: any): {
        label: string;
        value: any;
    };
    isEmpty(val: any): boolean;
    isString: (value: unknown) => value is string;
    isObject: (value: any) => value is Record<string, unknown>;
    range(startOrEnd: number, end?: number, step?: number): number[];
    mask2SubnetOp(val: number): string;
    formatStringOption: (option: string) => {
        label: string;
        value: string;
    };
    parseParamsToQuery: (params: {
        [key: string]: any;
    }) => {};
    parseSearchParamsToObject: (searchParams: URLSearchParams) => Record<string, string[] | Record<string, string[]>>;
    dispatchCustomEvent: (id: string, data: any) => void;
    isNumber: (value: any) => boolean;
    stringSort: (rowA: {
        values: {
            [key: string]: any;
        };
    }, rowB: {
        values: {
            [key: string]: any;
        };
    }, columnId: string) => number;
    isIp: (string: any) => string | false;
    formatBytes: (bytes: number, decimals?: number) => {
        value: number;
        text: string;
    } | {
        value: string;
        text: string;
    };
    formatBytesToString: (bytes: number, decimals?: number) => string | null;
    getTimeDiffObject: (time: string) => luxon.DurationObjectUnits;
    getTimeDiffString: (time: string, largest?: boolean) => string;
    formatISODate: (isoDate: string, showMili?: boolean, showSeconds?: boolean, showTime?: boolean) => string;
    formatDate: (dateIn: DateTime, showSeconds?: boolean, showMili?: boolean, showTime?: boolean) => string;
};
declare function insensitiveSort<Arr extends string[] | number[]>(array: Arr): Arr;
declare function insensitiveSort<Arr extends Record<Key, string>[] | Record<Key, number>[], Key extends string>(array: Arr, key: Key): Arr;

export { ActionsCell, ApiCallCell, BarCell, BlocksCell, Button, CapacityBar, CapacityCell, Checkbox, CircularProgress, CloseButton, Column, CustomTooltipCell, DataInfo, DateCell, DateFilter, DateTimePicker, EmptyPageMessage, EntityCell, ErrorPage, FilterBox, FilterButton, FilterHeader, FormSwitch, IconButtonCell, IconCell, Info, IpRangeTextBox, IpSubnetTextBox, IpTextBox, JsonBox, JsonEditor, Loader, LoginField, MenuPopper, MultiSelectFilter, MultilineCell, NewPasswordTooltip, NodeCell, NumInput, Pagination, PerPage, ProgressCell, RadioSwitch, Select, SelectFilter, SeverityCell, SeverityFilter, SpanTooltip, StatusCell, Switch, Tab, Table, TagsBox, TextArea, TextBox, TextField, TextFilter, TextSelectBox, TieringCell, TimeCell, Toast, ToggleButton, Tooltip, UploadField, UptimeCell, utils as Utils, useUrlFilters };
