import React from 'react'
import Tooltip from './components/Tooltip'
import { Hide, Show } from './svgs'
import { EMPTY_STRING, TIME_PARTS_SHORTENINGS } from './consts'
import { DateTime, DurationUnits } from 'luxon'

const utils = {
  insensitiveSort,
 isEllipsisActive(element: HTMLElement): boolean {
   return element.offsetWidth < element.scrollWidth
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
  isString: (value: unknown): value is string =>
    typeof value === 'string' || value instanceof String,
  isObject: (value: any): value is Record<string, unknown> => (typeof value === 'object' && (value !== null && !Array.isArray(value))),
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
  parseParamsToQuery: (params: { [key: string]: any }) => {
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
          if (innerVal) {
            acc.append(`${key}[${innerKey}]`, innerVal as any)
          }
        })
      } else if (!utils.isEmpty(value)) {
        acc.append(key, value)
      }
      return acc
    }, new URLSearchParams())
  },
  parseSearchParamsToObject: (searchParams: URLSearchParams) =>
    [...searchParams].reduce<
      Record<string, string[] | Record<string, string[]>>
    >((acc, [key, value]) => {
      const matchedObj = key.match(/([A-z_-]+)\[([A-z_-]+)\]/)
      if (matchedObj) {
        const [, objName, objKey] = matchedObj

        let objectValue = acc[objName]

        if (Array.isArray(objectValue)) {
          return acc
        }

        if (!objectValue) {
          objectValue = {}
          acc[objName] = objectValue
        }

        if (!objectValue[objKey]) {
          objectValue[objKey] = []
        }

        objectValue[objKey].push(value)
      } else if (!acc[key] || Array.isArray(acc[key])) {
        let arr = acc[key]

        if (!Array.isArray(arr)) {
          arr = []
        }

        arr.push(value)
        acc[key] = arr
      }

      return acc
    }, {}),
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
  getRelativeTimeFromISODate: (date: string, showSeconds = false) => {
    const units: DurationUnits = ['years', 'months', 'days', 'hours', 'minutes']
    if (showSeconds) {
      units.push('seconds')
    }
    const durationObj = DateTime.fromISO(date).toUTC().diffNow(units).toObject()
    let stringToShow = EMPTY_STRING
    let isPast = true
    const durationObjWithValues: { [key: string]: any } = {}
    Object.entries(durationObj).forEach(([key, val]) => {
      if (val) {
        durationObjWithValues[key] = val
      }
    })
    Object.entries(durationObjWithValues).forEach(([key, val], index) => {
      if (index < 2) {
        if (val > 0) {
          isPast = false
        }
        stringToShow += `${Math.floor(Math.abs(val))}${
          TIME_PARTS_SHORTENINGS[key]
        } `
      }
    })
    return isPast ? `${stringToShow} ago` : `in ${stringToShow}`
  }
}

function insensitiveSort<Arr extends string[] | number[]>(array: Arr): Arr

function insensitiveSort<
  Arr extends Record<Key, string>[] | Record<Key, number>[],
  Key extends string
>(array: Arr, key: Key): Arr

function insensitiveSort<Key extends string>(
  array: string[] | number[] | Record<Key, string>[] | Record<Key, number>[],
  key?: Key
) {
  const newArray = [...array]
  return newArray.sort((objA, objB) => {
    if (utils.isString(objA) && utils.isString(objB)) {
      return objA.toLowerCase().localeCompare(objB.toLowerCase())
    }

    if (typeof objA === 'number' && typeof objB === 'number') {
      return objA - objB
    }

    if (key && utils.isObject(objA) && utils.isObject(objB)) {
      const a = objA[key]
      const b = objB[key]

      if (utils.isString(a) && utils.isString(b)) {
        return a.toLowerCase().localeCompare(b.toLowerCase())
      }

      if (typeof a === 'number' && typeof b === 'number') {
        return a - b
      }

      return 0
    }

    return 0
  })
}

export default utils
