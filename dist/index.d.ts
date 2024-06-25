/// <reference types="react" />
import React, { MouseEventHandler, ReactNode, ReactElement, PropsWithChildren, Dispatch, SetStateAction } from 'react';
import { TooltipProps as TooltipProps$1 } from '@mui/material';
import { ColumnHelper, ColumnDef, SortingFn, Row, Cell, FilterFn, ColumnFilter, Table as Table$1, Column } from '@tanstack/react-table';
export { Cell, Column, FilterFn, Row, SortingFn } from '@tanstack/react-table';
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
    extraClass?: string;
}
declare function Info({ data, extraClass }: InfoProps): JSX.Element;

declare const Checkbox: React.ForwardRefExoticComponent<React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>;

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
    redInfo?: (value?: boolean) => string;
    [key: string]: any;
}
declare function FormSwitch({ onChange, oneColor, value, label, placeholder, isRequired, info, redInfo, ...rest }: FormSwitchProps): JSX.Element;

type Subnet = {
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
    shouldConvertSubnet2Mask?: boolean;
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
    expandInputOnFocus?: boolean;
}
declare function Select(props: SelectProps): JSX.Element;

interface TagsBoxProps {
    onChange: (newVal: any) => void;
    value: any;
    wrapperClass?: string;
    warning?: string;
    isRequired?: boolean;
    tagsValidation?: (val: string[]) => string[];
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
    tooltip?: string;
    disabled?: boolean;
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
    allowNegative?: boolean;
    autosize?: boolean;
    maxLength?: number;
    autofill?: boolean;
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
    onChange?: (newVal: any) => void;
    onReadError?: () => void;
    wrapperClass?: string;
    placeholder?: string;
    label: string;
    error?: string;
    disabled?: boolean;
    tooltipText?: string;
    shouldBeBinary?: boolean;
}
declare function UploadField(props: UploadFieldProps): JSX.Element;

interface CustomizableSelectProps {
    onChange?: (newVal: unknown) => void;
    sortOptions?: boolean;
    disabled?: boolean;
    isRequired?: boolean;
    value?: unknown;
    info?: string | ReactElement;
    wrapperClass?: string;
    error?: string;
    label?: string | ReactElement;
    options: Option[];
    redInfo?: (value: unknown) => string;
    placeholder?: string;
    isClearable?: boolean;
    autoFocus?: boolean;
    groupedOptions?: boolean;
    customValueValidation?: (val: string) => boolean;
    customValueError?: string;
    createLabel?: string;
}
declare function CustomizableSelect(props: CustomizableSelectProps): JSX.Element;

interface HideContentInputProps {
    wrapperClass?: string;
}
declare function HideContentInput(props: HideContentInputProps): JSX.Element;

declare function SearchButton(): JSX.Element;

declare function LinesCount(): JSX.Element;

declare function FontSizeControls(): JSX.Element;

declare function FoldAllButton(): JSX.Element;

interface TagsInputProps {
    wrapperClass?: string;
    addToUrl?: boolean;
}
declare function TagsInput(props: TagsInputProps): JSX.Element;

type ParsedData = [string, unknown][];

type TextEditorProviderProps = {
    pageStorageKey?: string;
};
declare function TextEditorProvider({ children, pageStorageKey }: PropsWithChildren<TextEditorProviderProps>): JSX.Element;

interface TextEditorProps {
    onChange?: () => void;
    readOnly?: boolean;
    value?: string;
    onValidate?: () => void;
    extraClass?: string;
    allowSearch?: boolean;
    allowCopy?: boolean;
    shouldFoldAll?: boolean;
    valueForMatched?: ParsedData;
    isValueForMatchedLoading?: boolean;
    mode?: 'text' | 'json';
    initialLine?: number;
    onScroll?: (line: number) => void;
    maxLines?: number;
    loading?: boolean;
    liteMode?: boolean;
}
declare function TextEditor(props: TextEditorProps): JSX.Element;
declare namespace TextEditor {
    var Provider: typeof TextEditorProvider;
    var TagsInput: typeof TagsInput;
    var FoldAllButton: typeof FoldAllButton;
    var FontSizeControls: typeof FontSizeControls;
    var LinesCount: typeof LinesCount;
    var SearchButton: typeof SearchButton;
    var HideContentInput: typeof HideContentInput;
}

interface LoaderProps {
    extraClass?: string;
}
declare function Loader({ extraClass }: LoaderProps): JSX.Element;

type menuItem = {
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

type TooltipProps = {
    children: ReactElement;
    clear?: boolean;
    data?: ReactElement | string;
    extraClass?: string;
    extraPopperClass?: string;
} & Pick<TooltipProps$1, 'open' | 'onClose' | 'onOpen'>;
declare function Tooltip({ children, clear, data, extraClass, extraPopperClass, ...rest }: TooltipProps): JSX.Element;

type SpanTooltipProps = {
    children: number | string;
    extraClasses?: string;
    style?: object;
} & Omit<TooltipProps, 'children' | 'data'>;
declare function SpanTooltip({ children, extraClasses, style, ...tooltipProps }: SpanTooltipProps): JSX.Element;

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
    setActive?: () => void;
    subComponent?: ReactElement | null;
    isSideTab?: boolean;
    isSubTab?: boolean;
    navigateTo?: string;
    info?: string;
    hasValidIndicator?: boolean;
    unfilledFields?: unknown[];
}
declare function Tab(props: TabProps): JSX.Element;

interface ToastProps {
    message: any;
    icon: any;
}
declare function Toast(props: ToastProps): JSX.Element;
declare namespace Toast {
    var propTypes: {};
}

type Option$1 = {
    label: string;
    value: string;
};
interface ToggleButtonProps {
    options: Option$1[];
    value: string;
    onChange: (newVal: any) => void;
}
declare function ToggleButton(props: ToggleButtonProps): JSX.Element;

interface ApiCallCellOptions<Data, Value> {
    apiCall: (cell: ExtendedCell<Data, Value>) => Promise<string>;
    errorText: string;
}
type ApiCallCellValue = never;
declare const ApiCallCellName = "ApiCallCell";
declare function ApiCallCell<Data>(props: ExtendedCellProps<Data, ApiCallCellValue>): JSX.Element;

type BarCellValue = number;
declare function BarCell<Data>(props: ExtendedCellProps<Data, BarCellValue>): JSX.Element;

interface BlocksCellOptions<Data> {
    showTotalCountOnly?: boolean;
    isLink?: boolean;
    getUrl?: (values: Data) => string;
    openInNewTab?: boolean;
}
type BlocksCellValue = {
    uid: string;
    id: string;
    status: string;
}[];
declare const BlocksCellName = "BlocksCell";
declare function BlocksCell<Data>(props: ExtendedCellProps<Data, BlocksCellValue>): JSX.Element;

interface CapacityCellOptions {
    noDataLabel?: string;
}
interface CapacityCellValue {
    used: number;
    total: number;
    isThin: boolean;
    maxThin: number;
    minThin: number;
    caution: boolean;
}
declare const CapacityCellName = "CapacityCell";
declare function CapacityCell<Data>(props: ExtendedCellProps<Data, CapacityCellValue>): JSX.Element;

interface DateCellOptions {
    showMili?: boolean;
    showRelative?: boolean;
    relativeOnly?: boolean;
    enableCustomFormat?: boolean;
    customFormat?: string;
}
type DateCellValue = string;
declare const DateCellName = "DateCell";
declare function DateCell<Data>(props: ExtendedCellProps<Data, DateCellValue>): JSX.Element;

interface DefaultCellOptions<Data, Value> {
    getUrl?: (values: Data) => string;
    openInNewTab?: boolean;
    tooltipText?: string | ((cell: ExtendedCell<Data, Value>) => string);
}
type DefaultCellValue = string | number | string[] | null | undefined;
declare const DefaultCellName = "DefaultCell";
declare function DefaultCell<Data>(props: ExtendedCellProps<Data, DefaultCellValue>): JSX.Element;

type EntityCellValue = string;
declare function EntityCell<Data>(props: ExtendedCellProps<Data, EntityCellValue>): JSX.Element;

interface IconButtonCellOptions<Data> {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean | ((rowValues: Data) => boolean);
    onClick: ((rowValues: Data) => void) | (() => void);
    tooltipText?: string | ((rowValues: Data) => string);
    extraClass?: string;
}
type IconButtonCellValue = never;
declare const IconButtonCellName = "IconButtonCell";
declare function IconButtonCell<Data>(props: ExtendedCellProps<Data, IconButtonCellValue>): JSX.Element;

interface IconCellOptions<Data> {
    Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    extraClass?: string | ((values: Data) => string);
    tooltipText?: string | ((values: Data) => string);
}
type IconCellValue = string | boolean | null | undefined;
declare const IconCellName = "IconCell";
declare function IconCell<Data>(props: ExtendedCellProps<Data, IconCellValue>): JSX.Element;

type NodeCellValue = {
    nid: string;
    isBackend: boolean;
    roles?: string[];
};
declare function NodeCell<Data>(props: ExtendedCellProps<Data, NodeCellValue>): JSX.Element;

type ProgressCellValue = {
    status: string;
    progress: string;
};
declare function ProgressCell<Data>(props: ExtendedCellProps<Data, ProgressCellValue>): JSX.Element;

type SeverityCellValue = string;
declare function SeverityCell<Data>(props: ExtendedCellProps<Data, SeverityCellValue>): JSX.Element;

interface StatusCellOptions<Data> {
    getTooltip?: (rowValues: Data) => string;
    showString?: boolean;
}
type StatusCellValue = string | null;
declare const StatusCellName = "StatusCell";
declare function StatusCell<Data>(props: ExtendedCellProps<Data, StatusCellValue>): JSX.Element;

interface SwitchCellOptions<Data> {
    onChange: (row: ExtendedRow<Data>) => void;
    tooltipText?: string | ((value: boolean) => string);
}
type SwitchCellValue = boolean;
declare const SwitchCellName = "SwitchCell";
declare function SwitchCell<Data>(props: ExtendedCellProps<Data, SwitchCellValue>): JSX.Element;

type TieringValue = {
    mode: string;
    name: string;
    state: string;
    detachProgress: number | null;
};
type TieringCellValue = TieringValue[];
declare function TieringCell<Data>(props: ExtendedCellProps<Data, TieringCellValue>): JSX.Element;

type TimeCellValue = number;
declare function TimeCell<Data>(props: ExtendedCellProps<Data, TimeCellValue>): JSX.Element;

type UptimeCellValue = string;
declare function UptimeCell<Data>(props: ExtendedCellProps<Data, UptimeCellValue>): JSX.Element;

declare function AggregatedTotalCell<Data>(props: ExtendedCellProps<Data>): string;

declare const createColumnHelperWithAction: <Data>() => ColumnHelper<Data> & {
    action: (actionDef: IconButtonCellOptions<Data>) => ColumnDef<Data, unknown>;
};

declare const PER_PAGE_OPTIONS: {
    value: number;
    label: string;
}[];

interface PerPageProps {
    value: string | number;
    onChange: ((val: string | number) => void) | Dispatch<SetStateAction<number>>;
    options?: typeof PER_PAGE_OPTIONS;
}
declare function PerPage({ value, onChange, options }: PerPageProps): JSX.Element;

declare const urlFilterParsers: {
    readonly boolean: (rawValue: Parameters<UrlFilterParser>[0]) => boolean | null;
    readonly string: (rawValue: Parameters<UrlFilterParser>[0]) => string | null;
    readonly arrayOfStrings: (rawValue: Parameters<UrlFilterParser>[0]) => string[] | null;
    readonly date: (rawValue: Parameters<UrlFilterParser>[0]) => {
        startTime: string;
        endTime: string;
    } | null;
    readonly severity: (rawValue: Parameters<UrlFilterParser>[0]) => string[] | null;
};

declare function useUrlFilters(props: {
    enabled?: boolean;
    filterConfig: {
        id: string;
        /**
         * If not provided stringParser will be used
         */
        filterParser?: UrlFilterParser | keyof typeof urlFilterParsers;
    }[];
    filterCategory: string;
}): [
    ExtendedColumnFilter[],
    (filters: ExtendedColumnFilter[] | ((prevState: ExtendedColumnFilter[]) => ExtendedColumnFilter[])) => void
];

declare const TABLE_FILTERS_MAP: {
    readonly multiSelect: {
        readonly component: typeof MultiSelectFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => string[] | null;
        readonly filterFn: <Data>(row: ExtendedRow<Data>, columnId: string, filterValue: string | string[] | number[]) => boolean;
    };
    readonly select: {
        readonly component: typeof SelectFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => string | null;
        readonly filterFn: "equalsString";
    };
    readonly date: {
        readonly component: typeof DateFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => {
            startTime: string;
            endTime: string;
        } | null;
        readonly filterFn: <Data_1>(row: ExtendedRow<Data_1>, columnId: string, { startTime, endTime }: {
            startTime?: string | undefined;
            endTime?: string | undefined;
        }) => boolean;
    };
    readonly text: {
        readonly component: typeof TextFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => string | null;
        readonly filterFn: "includesString";
    };
    readonly severity: {
        readonly component: typeof SeverityFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => string[] | null;
        readonly filterFn: <Data_2>(row: ExtendedRow<Data_2>, columnId: string, filterValue: "DEBUG" | "INFO" | "WARNING" | "MINOR" | "MAJOR" | "CRITICAL") => boolean;
    };
};

type FilterTypes = keyof typeof TABLE_FILTERS_MAP;

type PaginationProps = {
    onPageChange: (page: number) => void;
    defaultCurrentPage?: number;
    isLoading?: boolean;
} & ({
    totalRows: number;
    rowsPerPage: number;
    numberOfPages?: undefined;
} | {
    numberOfPages: number;
    totalRows?: undefined;
    rowsPerPage?: undefined;
});
declare function Pagination(props: PaginationProps): JSX.Element | null;

type DateFilterOptions = {
    enableCustomFormat?: boolean;
    customFormat?: string;
};
interface DateFilterValue {
    startTime?: string;
    endTime?: string;
}
declare function DateFilter<Data>({ column, filterOptions }: ExtendedFilterProps<Data, DateFilterValue, DateFilterOptions>): JSX.Element;

interface MultiSelectFilterOptions {
    fixedOptions?: string[];
}
declare function MultiSelectFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, MultiSelectFilterOptions>): JSX.Element;

interface SelectFilterOptions {
    fixedOptions?: string[];
}
declare function SelectFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, SelectFilterOptions>): JSX.Element;

declare function SeverityFilter<Data, Value>({ column }: ExtendedFilterProps<Data, Value>): JSX.Element;

interface TextFilterOptions {
    shouldDisableBtn?: (val: string) => boolean;
    disabledBtnTooltip?: string;
}
declare function TextFilter<Data, Value>({ column, filterOptions }: ExtendedFilterProps<Data, Value, TextFilterOptions>): JSX.Element;

type ExtendedTable<Data> = Table$1<Data>;
type ExtendedColumnDef<Data, Value> = ColumnDef<Data, Value>;
type ExtendedColumn<Data, Value> = Column<Data, Value>;
type ExtendedRow<Data> = Row<Data>;
type ExtendedCell<Data, Value> = Cell<Data, Value>;
interface ExtendedCellProps<Data, Value> {
    table: ExtendedTable<Data>;
    row: ExtendedRow<Data>;
    column: ExtendedColumn<Data, Value>;
    cell: ExtendedCell<Data, Value>;
    getValue: () => unknown;
    renderValue: () => unknown;
    customValue?: Value;
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
} & (never | CellOptions<Type, Options>);
declare module '@tanstack/react-table' {
    interface SortingFns {
        stringSort: SortingFn<unknown>;
        numberSort: SortingFn<unknown>;
    }
    interface ColumnMeta<TData, TValue> {
        defaultHidden?: boolean;
        headerTooltip?: string;
        filter?: FilterDef<TData, 'date', DateFilterOptions> | FilterDef<TData, 'multiSelect', MultiSelectFilterOptions> | FilterDef<TData, 'select', SelectFilterOptions> | FilterDef<TData, 'severity'> | FilterDef<TData, 'text', TextFilterOptions>;
        cell?: CellDef<TData, TValue, typeof ApiCallCellName, ApiCallCellOptions<TData, TValue>> | CellDef<TData, TValue, typeof CapacityCellName, CapacityCellOptions> | CellDef<TData, TValue, typeof StatusCellName, StatusCellOptions<TData>> | CellDef<TData, TValue, typeof BlocksCellName, BlocksCellOptions<TData>> | CellDef<TData, TValue, typeof DateCellName, DateCellOptions> | CellDef<TData, TValue, typeof SwitchCellName, SwitchCellOptions<TData>> | CellDef<TData, TValue, typeof IconCellName, IconCellOptions<TData>> | CellDef<TData, TValue, typeof DefaultCellName, DefaultCellOptions<TData, TValue>> | CellDef<TData, TValue, typeof IconButtonCellName, IconButtonCellOptions<TData>>;
        columnTitle?: string;
        _type?: 'column' | 'action';
    }
}
type BaseFilterProps<Data, Value> = {
    column: ExtendedColumn<Data, Value>;
};
type ExtendedFilterProps<Data, Value, FilterOptions = unknown> = BaseFilterProps<Data, Value> & {
    filterOptions: FilterOptions;
};
interface UrlFilterParser {
    (rawValue: string[] | Record<string, string[]>): unknown;
}
interface TableExtraClasses {
    tableWrapper?: string;
    tableLine?: string;
    expandCell?: string;
    tableCell?: string;
}
interface RowAction<Data> {
    hideAction: boolean | ((rowValues: Data) => boolean);
    action?: ((rowValues: Data) => void) | (() => void);
    content?: string | ((rowValues: Data) => HTMLElement);
    disabled?: boolean | ((rowValues: Data) => boolean);
    text?: string;
}
type ExtendedColumnFilter = ColumnFilter & {
    defaultFilter?: boolean;
};

interface TableProps<Data, Value> {
    columns: ExtendedColumnDef<Data, Value>[];
    data: Data[];
    filterCategory: string;
    title?: string;
    maxRows?: number;
    rowActions?: RowAction<Data>[];
    emptyMessage?: string;
    tableActions?: Array<ReactNode>;
    defaultSort?: string;
    globalFilter?: any;
    globalFilterFn?: FilterFn<Data>;
    defaultGlobalFilter?: string;
    checkRowSelected?: (row: object) => boolean;
    checkRowHighlighted?: (row: object) => boolean;
    getRowId?: (originalRow: Data, index: number, parent?: ExtendedRow<Data>) => string;
    addFilterToUrl?: boolean;
    RowSubComponent?: React.FC<{
        row: any;
    }>;
    listenerPrefix?: string;
    onRowClick?: (values?: Data) => void;
    miniTable?: boolean;
    fixedPageSize?: number;
    disableActionsPortal?: boolean;
    manualPagination?: boolean;
    itemsAmount?: number;
    canExpandAll?: boolean;
    loading?: boolean;
    onFiltersChanged?: (newFilters: ExtendedColumnFilter[]) => void;
    defaultDescendingSort?: boolean;
    manualFilters?: boolean;
    initialFilters?: ColumnFilter[];
    extraClasses?: TableExtraClasses;
    /**
     * Must be memoized
     */
    grouping?: string[];
    hasCustomDateFormat?: boolean;
    customDateFormat?: string;
    hasResizableColumns?: boolean;
    hasEmptyActionsCell?: boolean;
    collapseRowsOnLeavingPage?: boolean;
    onSortChanged?: (sort: {
        id: string;
        desc?: boolean;
    }) => void;
    manualSorting?: boolean;
}
declare function Table<Data, Value>(props: TableProps<Data, Value>): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Table>;

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
    enableCustomFormat?: boolean;
    customFormat?: string;
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

interface FilterButtonProps {
    onClick: () => void;
    disable?: boolean;
    extraClass?: string;
    tooltipText?: string;
}
declare function FilterButton({ onClick, disable, extraClass, tooltipText }: FilterButtonProps): JSX.Element;

interface CopyProps {
    text: string;
    extraClass?: string;
    copyIcon?: ReactNode;
    copyText?: string;
}
declare function Copy(props: CopyProps): JSX.Element;

interface SummaryProps {
    title: string;
    children: ReactNode;
    expanded?: boolean;
    onExpand?: (expanded: boolean) => void;
}
declare function Summary(props: SummaryProps): JSX.Element;

interface ExpandCollapseButtonProps {
    onChange: (shouldCollapse: boolean) => void;
    shouldCollapse: boolean;
    disabled?: boolean;
    tooltip?: string;
}
declare function ExpandCollapseButton(props: ExpandCollapseButtonProps): JSX.Element;

declare function ShowMore(props: {
    isClose: boolean;
    onClick: () => void;
    extraClass?: string;
    disabled?: boolean;
    tooltip?: string;
}): JSX.Element;

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
    getRelativeTimeFromISODate: (date: string, showSeconds?: boolean) => string;
};
declare function insensitiveSort<Arr extends string[] | number[]>(array: Arr): Arr;
declare function insensitiveSort<Arr extends Record<Key, string>[] | Record<Key, number>[], Key extends string>(array: Arr, key: Key): Arr;

export { AggregatedTotalCell, ApiCallCell, ApiCallCellName, ApiCallCellOptions, ApiCallCellValue, BarCell, BarCellValue, BlocksCell, BlocksCellName, BlocksCellOptions, BlocksCellValue, Button, CapacityBar, CapacityCell, CapacityCellName, CapacityCellOptions, CapacityCellValue, Checkbox, CircularProgress, CloseButton, Copy, CustomizableSelect, DataInfo, DateCell, DateCellName, DateCellOptions, DateCellValue, DateTimePicker, DefaultCell, DefaultCellName, DefaultCellOptions, DefaultCellValue, EmptyPageMessage, EntityCell, EntityCellValue, ErrorPage, ExpandCollapseButton, FilterButton, FormSwitch, IconButtonCell, IconButtonCellName, IconButtonCellOptions, IconButtonCellValue, IconCell, IconCellName, IconCellOptions, IconCellValue, Info, IpRangeTextBox, IpSubnetTextBox, IpTextBox, JsonBox, Loader, LoginField, MenuPopper, NewPasswordTooltip, NodeCell, NodeCellValue, NumInput, Pagination, PerPage, ProgressCell, ProgressCellValue, RadioSwitch, Select, SeverityCell, SeverityCellValue, ShowMore, SpanTooltip, StatusCell, StatusCellName, StatusCellOptions, StatusCellValue, Summary, Switch, SwitchCell, SwitchCellName, SwitchCellOptions, SwitchCellValue, Tab, _default as Table, TagsBox, TextArea, TextBox, TextEditor, TextField, TextSelectBox, TieringCell, TieringCellValue, TimeCell, TimeCellValue, Toast, ToggleButton, Tooltip, UploadField, UptimeCell, UptimeCellValue, utils as Utils, createColumnHelperWithAction as createColumnHelper, useUrlFilters };
