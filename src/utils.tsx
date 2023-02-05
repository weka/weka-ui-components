import React from 'react'
import Tooltip from './components/Tooltip'
import { Hide, Show } from './svgs'
import { EMPTY_STRING } from './consts'
import { DateTime } from 'luxon'

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
  parseParamsToQuery: (params: {[key: string]: any}) => {
    if (!params) {
      return {}
    }
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val) {
            acc.append(key, val)
          }
        })
      } else if (utils.isObject(value)) {
        Object.entries(value).forEach(([innerKey, innerVal]) => {
          acc.append(`${key}[${innerKey}]`, innerVal as any)
        })
      } else if (!utils.isEmpty(value)) {
        acc.append(key, value)
      }
      return acc
    }, new URLSearchParams())
  },
  dispatchCustomEvent: (id: string, data: any) => {
    document.dispatchEvent(new CustomEvent(id, { detail: data }))
  },
  isNumber: (value: any) => {
    try {
      return !isNaN(value)
    } catch (e) {
      return false
    }
  },
  stringSort: (rowA: { values: { [key: string]: any } }, rowB: { values: { [key: string]: any } }, columnId: string): number=> {
    const _getRowValuesByColumn4 = [rowA.values[columnId], rowB.values[columnId]]
    let a = _getRowValuesByColumn4[0] || EMPTY_STRING
    let b = _getRowValuesByColumn4[1] || EMPTY_STRING
    // eslint-disable-next-line no-restricted-globals
    if (utils.isNumber(a) && utils.isNumber(b)) {
      if (utils.isEmpty(a)) {
        return 1
      }
      if (utils.isEmpty(b)) {
        return -1
      }
      const numberA = parseFloat(a)
      const numberB = parseFloat(b)
      if (numberA === numberB) {
        return 0
      }
      return numberA > numberB ? 1 : -1
    }

    if (utils.isIp(a) || utils.isIp(b)) {
      if (utils.isEmpty(a)) {
        return 1
      }
      if (utils.isEmpty(b)) {
        return -1
      }
      const num1 = Number(a.split('.').map((num: string) => (`000${num}`).slice(-3)).join(''))
      const num2 = Number(b.split('.').map((num: string) => (`000${num}`).slice(-3)).join(''))
      return num1 - num2
    }

    if (!utils.isString(a) || !utils.isString(b)) {
      if (Array.isArray(a) && Array.isArray(b)) {
        a = a.length
        b = b.length
        if (!a) {
          return 1
        }
        if (!b) {
          return -1
        }
      }
      if (a === b) {
        return 0
      }
      return a > b ? 1 : -1
    }

    if (!a.length) {
      return 1
    }
    if (!b.length) {
      return -1
    }

    const collator = Intl.Collator(undefined, {numeric: true})
    return collator.compare(a, b)
  },
  isIp: (string: any) => {
    if (!utils.isString(string)) return false
    const ValidIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
    if (ValidIpAddressRegex.test(string)) {
      const isValid = (valid: boolean, part: string) => {
        const numPart = parseInt(part, 10)
        return valid && (numPart >= 0) && (numPart < 256)
      }
      return string.split('.').reduce(isValid)
    }
    return false
  },
  formatBytes: (bytes: number, decimals = 2) => {
    if (bytes === 0) return { value: 0, text: 'Bytes' }
    const isNegative = bytes < 0
    if (isNegative) {
      bytes *= -1
    }
    const k = 1000
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return { value: ((isNegative ? bytes * -1 : bytes) / k ** i).toFixed(dm), text: `${sizes[i]}` }
  },
  formatBytesToString: (bytes: number, decimals?: number) => {
    if (utils.isEmpty(bytes)) {
      return null
    }
    const { value, text } = utils.formatBytes(bytes, decimals)
    return `${value} ${text}`
  },
  getTimeDiffObject: (time: string) => DateTime.fromISO(time).diffNow(['days', 'hours', 'minutes']).toObject(),
  getTimeDiffString: (time: string, largest = false) => {
  if (!time) {
    return EMPTY_STRING
  }
  const keys = ['days', 'hours', 'minutes']
  const diffObject: { [key: string]: any }= utils.getTimeDiffObject(time)
  let ans = ''
  keys.forEach((key) => {
    if (!largest || (largest && ans === '' && diffObject[key])) {
      if (diffObject[key] < 0) {
        ans = `${ans} ${Math.round(diffObject[key]) * -1}${key.charAt(0)}`
      } else {
        ans = `${ans} ${Math.round(diffObject[key])}${key.charAt(0)}`
      }
    }
  })
  return ans.trim() || '0m'
  },
  formatISODate: (isoDate: string, showMili = true, showSeconds = true, showTime = true) => `${DateTime.fromISO(isoDate).toLocaleString({
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
})} ${showTime ? DateTime.fromISO(isoDate).toLocaleString({
  hour: '2-digit',
  minute: '2-digit',
  ...(showSeconds && { second: '2-digit' }),
  ...(showMili && showSeconds && { fractionalSecondDigits: 3 }),
  hourCycle: 'h23'
}) : EMPTY_STRING}`,
  formatDate: (dateIn: DateTime, showSeconds = true, showMili = true, showTime = true) => {
    if (!(dateIn instanceof DateTime) && !(Object.getPrototypeOf(dateIn).constructor.name === 'DateTime')) {
      return 'Not Valid DateTime Object'
    }
    return utils.formatISODate(dateIn.toISO(), showMili, showSeconds, showTime)
  },
}

export default utils
