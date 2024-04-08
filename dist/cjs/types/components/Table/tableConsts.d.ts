import { DateFilter, MultiSelectFilter, SelectFilter, SeverityFilter, TextFilter } from './components';
export declare const ROW_HEIGHT = 52;
export declare const ROWS_PER_PAGE_RATIO = 1.5;
export declare const TABLE_FILTERS_MAP: {
    readonly multiSelect: {
        readonly component: typeof MultiSelectFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => string[] | null;
        readonly filterFn: <Data>(row: import("./types").ExtendedRow<Data>, columnId: string, filterValue: string | string[] | number[]) => boolean;
    };
    readonly select: {
        readonly component: typeof SelectFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => string | null;
    };
    readonly date: {
        readonly component: typeof DateFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => {
            startTime: string;
            endTime: string;
        } | null;
        readonly filterFn: <Data_1>(row: import("./types").ExtendedRow<Data_1>, columnId: string, { startTime, endTime }: {
            startTime?: string | undefined;
            endTime?: string | undefined;
        }) => boolean;
    };
    readonly text: {
        readonly component: typeof TextFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => string | null;
    };
    readonly severity: {
        readonly component: typeof SeverityFilter;
        readonly parser: (rawValue: string[] | Record<string, string[]>) => null;
        readonly filterFn: <Data_2>(row: import("./types").ExtendedRow<Data_2>, columnId: string, filterValue: "DEBUG" | "INFO" | "WARNING" | "MINOR" | "MAJOR" | "CRITICAL") => boolean;
    };
};
