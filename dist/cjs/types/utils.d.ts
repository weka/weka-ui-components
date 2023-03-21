import React from 'react';
import { DateTime } from 'luxon';
declare const utils: {
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
    isString: (value: any) => boolean;
    isObject: (value: any) => boolean;
    insensitiveSort(array: any[], key: string): any[];
    range(startOrEnd: number, end?: number, step?: number): number[];
    mask2SubnetOp(val: number): string;
    formatStringOption: (option: string) => {
        label: string;
        value: string;
    };
    parseParamsToQuery: (params: {
        [key: string]: any;
    }) => {};
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
    isIp: (string: any) => any;
    formatBytes: (bytes: number, decimals?: number) => {
        value: number;
        text: string;
    } | {
        value: string;
        text: string;
    };
    formatBytesToString: (bytes: number, decimals?: number) => string | null;
    getTimeDiffObject: (time: string) => import("luxon").DurationObjectUnits;
    getTimeDiffString: (time: string, largest?: boolean) => string;
    formatISODate: (isoDate: string, showMili?: boolean, showSeconds?: boolean, showTime?: boolean) => string;
    formatDate: (dateIn: DateTime, showSeconds?: boolean, showMili?: boolean, showTime?: boolean) => string;
};
export default utils;
