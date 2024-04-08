import { Severities } from '../../consts';
import { ExtendedColumn, ExtendedRow, UrlFilterParser } from './types';
export declare const tableUtils: {
    getColumnTitle: <Data, Value>(column: ExtendedColumn<Data, Value>) => string;
    isAccessorColumn: <Data_1, Value_1>(column: ExtendedColumn<Data_1, Value_1>) => boolean;
};
export declare const sortingFns: {
    stringSort: <Data>(rowA: ExtendedRow<Data>, rowB: ExtendedRow<Data>, columnId: string) => number;
};
export declare const urlFilterParsers: {
    readonly string: (rawValue: Parameters<UrlFilterParser>[0]) => string | null;
    readonly arrayOfStrings: (rawValue: Parameters<UrlFilterParser>[0]) => string[] | null;
    readonly date: (rawValue: Parameters<UrlFilterParser>[0]) => {
        startTime: string;
        endTime: string;
    } | null;
    readonly severity: (rawValue: Parameters<UrlFilterParser>[0]) => null;
};
export declare const filterFns: {
    readonly multiSelect: <Data>(row: ExtendedRow<Data>, columnId: string, filterValue: string[] | number[] | string) => boolean;
    readonly date: <Data_1>(row: ExtendedRow<Data_1>, columnId: string, { startTime, endTime }: {
        startTime?: string | undefined;
        endTime?: string | undefined;
    }) => boolean;
    readonly severity: <Data_2>(row: ExtendedRow<Data_2>, columnId: string, filterValue: Severities) => boolean;
};
