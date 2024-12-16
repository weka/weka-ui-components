import { default as React } from 'react';
import { TOASTER_TYPES } from './consts';
import { DateTime } from 'luxon';
interface CustomEventPayload {
    status: string;
    message: string;
}
interface Error {
    data: {
        error?: string;
    } | {
        message?: string;
    } | string | unknown;
}
declare const utils: {
    insensitiveSort: typeof insensitiveSort;
    isEllipsisActive(element: HTMLElement, isMultiLine?: boolean): boolean;
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
    toastError: (err?: string | Error | unknown, type?: (typeof TOASTER_TYPES)[keyof typeof TOASTER_TYPES], toastId?: string) => void;
    toastSuccess: (message: string, type?: (typeof TOASTER_TYPES)[keyof typeof TOASTER_TYPES]) => void;
    mask2SubnetOp(val: number): string;
    formatStringOption: (option: string) => {
        label: string;
        value: string;
    };
    parseParamsToQuery: (params: {
        [key: string]: any;
    }) => {};
    parseSearchParamsToObject: (searchParams: URLSearchParams) => Record<string, string[] | Record<string, string[]>>;
    dispatchCustomEvent: (id: string, data: CustomEventPayload) => void;
    isNumber: (value: any) => boolean;
    isIp: (string: any) => string | false;
    isIpSubnet: (string: string) => boolean | "";
    getUnitsFromBase(base: number): string[];
    formatBytes: (bytes: number | null, decimals?: number, k?: number) => {
        value: number;
        text: string;
    } | {
        value: string;
        text: string;
    };
    formatBytesToString: (bytes: number, decimals?: number, k?: number) => string | null;
    getTimeDiffObject: (time: string) => import('luxon').DurationObjectUnits;
    getTimeDiffString: (time: string, largest?: boolean) => string;
    formatISODate: (isoDate: string, showMili?: boolean, showSeconds?: boolean, showTime?: boolean) => string;
    formatDate: (dateIn: DateTime, showSeconds?: boolean, showMili?: boolean, showTime?: boolean) => string;
    getRelativeTimeFromISODate: (date: string, showSeconds?: boolean) => string;
    capitalize: (str: string) => string;
    debounce: (callback: any, wait?: number) => (...args: any[]) => void;
};
declare function insensitiveSort<Arr extends string[] | number[]>(array: Arr): Arr;
declare function insensitiveSort<Arr extends Record<Key, string>[] | Record<Key, number>[], Key extends string>(array: Arr, key: Key): Arr;
export default utils;
