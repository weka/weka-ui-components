import React from 'react'
import Tooltip from './components/Tooltip'
import { Hide, Show } from './svgs'
import { EMPTY_STRING } from './consts'

const utils = {
 isEllipsisActive(element: HTMLElement): boolean {
   return element.offsetWidth < element.scrollWidth;
 },
  getPasswordIcon(showPassword: boolean, toggleShowPassword: () => void): React.ReactElement {
    if (showPassword) {
      return (
          <Tooltip data="Hide password" placement="right">
            <Show onClick={toggleShowPassword} />
          </Tooltip>
      )
    }
    return (
        <Tooltip data="Show password" placement="right">
          <Hide onClick={toggleShowPassword} />
        </Tooltip>
    );
  },
    goToNextInput(): void {
    const nextInput: HTMLInputElement | null = document.activeElement?.parentElement?.nextElementSibling?.firstElementChild as HTMLInputElement | null
    if (nextInput) {
      nextInput.focus()
      nextInput.select()
    }
  },
  goToPreviousInput(): void {
    const previousInput: HTMLInputElement | null = document.activeElement?.parentElement?.previousElementSibling?.firstElementChild as HTMLInputElement | null
    if (previousInput) {
      previousInput.focus()
      previousInput.select()
    }
  },
  subnet2MaskOp(subnet: string): string {
  return subnet
    ? subnet
      .split('.')
      .reduce((globalBitMaskCounter: number, byte: string) => (
        [0, 1, 2, 3, 4, 5, 6, 7]
          .reduce((bitMaskCounter: number, shiftingIndex: number) => (bitMaskCounter + ((parseInt(byte, 10) >> shiftingIndex) & 1)),
            globalBitMaskCounter)), 0).toString()
    : '';
},
  formatOption(label: string, value?: any): { label: string, value: any } {
    return value !== undefined ? {label, value } : { label, value: label };
  },
  isEmpty(val: any): boolean {
    return val === null // null
        || val === undefined // undefined
        || val === EMPTY_STRING // empty string
        || (Array.isArray(val) && !val.length) // empty array
        || (Object.prototype.toString.call(val) === '[object Number]' && isNaN(val)) /* eslint-disable-line */ // NaN
        || (typeof val === 'object'
            && !Object.keys(val).length // empty object
            && Object.prototype.toString.call(val) !== '[object Date]') // Date
  },
  isString: (value: any) => (typeof value === 'string' || value instanceof String),
  isObject: (value: any) => (typeof value === 'object' && (value !== null && !Array.isArray(value))),
  insensitiveSort(array: any[], key:string) {
    const newArray = [...array]
    return newArray.sort((objA, objB) => {
      if (key) {
        return objA[key].toLowerCase().localeCompare(objB[key].toLowerCase())
      }
      return objA.toLowerCase().localeCompare(objB.toLowerCase())
    })
  },
  range(startOrEnd: number, end?: number, step: number = 1): number[] {
  let newStartOrEnd = startOrEnd;
  if (!end) {
    end = newStartOrEnd;
    newStartOrEnd = 0;
  }
  const result: number[] = [];
  for (let i = newStartOrEnd; i < end; i += step) {
    result.push(i);
  }
  return result;
},
 mask2SubnetOp(val: number): string {
  return [255, 255, 255, 255]
    .map(() => [0, 1, 2, 3, 4, 5, 6, 7]
     .reduce((rst: number) => (rst * 2 + (val-- > 0 ? 1 : 0)), 0))
    .join('.')
},
  formatStringOption: (option: string) => ({ label: option, value: option }),

}

export default utils
