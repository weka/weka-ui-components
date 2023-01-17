import React from 'react';
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
};
export default utils;
