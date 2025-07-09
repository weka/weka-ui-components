import React from 'react'
import { toast } from 'react-toastify'
import { Approve, Hide, Show, Warning } from './svgs'
import {
  DIALOG_STATUSES,
  DOWNLOAD_FAILED,
  EMPTY_STRING,
  TIME_PARTS_SHORTENINGS,
  TOASTER_DIALOG,
  TOASTER_DIALOG_DISMISS,
  TOASTER_TYPES
} from 'consts'
import { DateTime, DurationUnits } from 'luxon'
import { Toast, Tooltip } from './components'

export const MIME_TYPES = {
  CSV: 'text/csv',
  PLAIN: 'text/plain',
  GZIP: 'application/x-gzip',
  OCTET_STREAM: 'application/octet-stream',
  JSON: 'application/json'
} as const

interface CustomEventPayload {
  status: string
  message: string
}

interface Error {
  data: { error?: string } | { message?: string } | string | unknown
}

let uniqueIdCache = 0

const utils = {
  insensitiveSort,
  uniqueId: () => {
    uniqueIdCache += 1
    return uniqueIdCache.toString()
  },
  isEllipsisActive(element: HTMLElement, isMultiLine = false): boolean {
    return isMultiLine
      ? element.scrollHeight > element.clientHeight
      : element.offsetWidth < element.scrollWidth
  },
  getPasswordIcon(
    showPassword: boolean,
    toggleShowPassword: () => void,
    passwordTooltip = 'password'
  ): React.ReactElement {
    if (showPassword) {
      return (
        <Tooltip data={`Hide ${passwordTooltip}`} placement='right'>
          <Show onClick={toggleShowPassword} />
        </Tooltip>
      )
    }
    return (
      <Tooltip data={`Show ${passwordTooltip}`} placement='right'>
        <Hide onClick={toggleShowPassword} />
      </Tooltip>
    )
  },
  goToNextInput(): void {
    const nextInput: HTMLInputElement | null = document.activeElement
      ?.parentElement?.nextElementSibling
      ?.firstElementChild as HTMLInputElement | null
    if (nextInput) {
      nextInput.focus()
      nextInput.select()
    }
  },
  goToPreviousInput(): void {
    const previousInput: HTMLInputElement | null = document.activeElement
      ?.parentElement?.previousElementSibling
      ?.firstElementChild as HTMLInputElement | null
    if (previousInput) {
      previousInput.focus()
      previousInput.select()
    }
  },
  subnet2MaskOp(subnet: string): string {
    return subnet
      ? subnet
          .split('.')
          .reduce(
            (globalBitMaskCounter: number, byte: string) =>
              [0, 1, 2, 3, 4, 5, 6, 7].reduce(
                (bitMaskCounter: number, shiftingIndex: number) =>
                  bitMaskCounter + ((parseInt(byte, 10) >> shiftingIndex) & 1),
                globalBitMaskCounter
              ),
            0
          )
          .toString()
      : EMPTY_STRING
  },
  formatOption(label: string, value?: any): { label: string; value: any } {
    return value !== undefined ? { label, value } : { label, value: label }
  },
  isEmpty(val: any): boolean {
    return (
      val === null || // null
      val === undefined || // undefined
      val === EMPTY_STRING || // empty string
      (Array.isArray(val) && !val.length) || // empty array
      (Object.prototype.toString.call(val) === '[object Number]' &&
        isNaN(val)) /* eslint-disable-line */ || // NaN
      (typeof val === 'object' &&
        !Object.keys(val).length && // empty object
        Object.prototype.toString.call(val) !== '[object Date]')
    ) // Date
  },
  isString: (value: unknown): value is string =>
    typeof value === 'string' || value instanceof String,
  isObject: (value: any): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value),
  range(startOrEnd: number, end?: number, step = 1): number[] {
    let newStartOrEnd = startOrEnd
    if (!end) {
      end = newStartOrEnd
      newStartOrEnd = 0
    }
    const result: number[] = []
    for (let i = newStartOrEnd; i < end; i += step) {
      result.push(i)
    }
    return result
  },
  toastError: (
    err?: string | Error | unknown,
    type?: (typeof TOASTER_TYPES)[keyof typeof TOASTER_TYPES],
    toastId?: string
  ) => {
    let message = 'Something went wrong'

    if (typeof err === 'string') {
      message = err
    } else if (
      err &&
      typeof err === 'object' &&
      'message' in err &&
      typeof err.message === 'string'
    ) {
      message = err.message
    } else if (err && typeof err === 'object' && 'data' in err) {
      if (typeof err.data === 'string') {
        message = err.data
      } else if (
        err.data &&
        typeof err.data === 'object' &&
        'error' in err.data &&
        typeof err.data.error === 'string'
      ) {
        message = err.data.error
      }
    }

    if (
      (type !== TOASTER_TYPES.DIALOG && message.length < 75) ||
      type === TOASTER_TYPES.TOAST
    ) {
      if (toastId) {
        if (!toast.isActive(toastId)) {
          toast.error(<Toast message={message} icon={<Warning />} />, {
            position: toast.POSITION.BOTTOM_CENTER,
            icon: false,
            toastId
          })
        }
      } else {
        toast.error(<Toast message={message} icon={<Warning />} />, {
          position: toast.POSITION.BOTTOM_CENTER,
          icon: false
        })
      }
    } else {
      utils.dispatchCustomEvent(TOASTER_DIALOG, {
        status: DIALOG_STATUSES.ERROR,
        message
      })
    }
  },
  toastSuccess: (
    message: string,
    type?: (typeof TOASTER_TYPES)[keyof typeof TOASTER_TYPES]
  ) => {
    if (
      (type !== TOASTER_TYPES.DIALOG && message.length < 100) ||
      type === TOASTER_TYPES.TOAST
    ) {
      toast.success(<Toast message={message} icon={<Approve />} />, {
        position: toast.POSITION.BOTTOM_CENTER,
        icon: false
      })
    } else {
      utils.dispatchCustomEvent(TOASTER_DIALOG, {
        status: DIALOG_STATUSES.SUCCESS,
        message
      })
    }
  },
  mask2SubnetOp(val: number): string {
    return [255, 255, 255, 255]
      .map(() =>
        [0, 1, 2, 3, 4, 5, 6, 7].reduce(
          (rst: number) => rst * 2 + (val-- > 0 ? 1 : 0),
          0
        )
      )
      .join('.')
  },
  formatStringOption: (option: string) => ({ label: option, value: option }),
  formatIconStringOption: ({
    value,
    label,
    icon
  }: {
    value: string | number
    label: string
    icon?: React.ReactNode
  }) => {
    return { label: label || value, value, icon }
  },
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
  dispatchCustomEvent: (id: string, data: CustomEventPayload) => {
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
    if (!utils.isString(string)) {
      return false
    }
    const ValidIpAddressRegex =
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
    if (ValidIpAddressRegex.test(string)) {
      const isValid = (valid: boolean, part: string) => {
        const numPart = parseInt(part, 10)
        return valid && numPart >= 0 && numPart < 256
      }
      return string.split('.').reduce(isValid)
    }
    return false
  },
  isIpSubnet: (string: string) => {
    if (!utils.isString(string)) {
      return false
    }
    const SubnetMaskRegex = /^([0-9]|[12][0-9]|3[0-2])$/
    const [ipVal, subnet] = string.split('/')
    return utils.isIp(ipVal) && SubnetMaskRegex.test(subnet)
  },
  getUnitsFromBase(base: number) {
    if (base === 1024) {
      return ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    }
    return ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  },
  formatBytes: (bytes: number | null, decimals = 2, k = 1000) => {
    if (bytes === 0 || bytes === null) {
      return { value: 0, text: utils.getUnitsFromBase(k)[0] }
    }

    const dm = decimals < 0 ? 0 : decimals
    const isNegative = bytes < 0
    if (isNegative) {
      bytes *= -1
    } else if (bytes < 1) {
      return { value: bytes.toFixed(dm), text: 'Bytes' }
    }

    const sizes = utils.getUnitsFromBase(k)
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return {
      value: ((isNegative ? bytes * -1 : bytes) / k ** i).toFixed(dm),
      text: `${sizes[i]}`
    }
  },
  formatBytesToString: (bytes: number, decimals?: number, k = 1000) => {
    if (utils.isEmpty(bytes)) {
      return null
    }
    const { value, text } = utils.formatBytes(bytes, decimals, k)
    return `${value} ${text}`
  },
  getTimeDiffObject: (time: string) =>
    DateTime.fromISO(time).diffNow(['days', 'hours', 'minutes']).toObject(),
  getTimeDiffString: (time: string, largest = false) => {
    if (!time) {
      return EMPTY_STRING
    }
    const keys = ['days', 'hours', 'minutes']
    const diffObject: { [key: string]: any } = utils.getTimeDiffObject(time)
    let ans = EMPTY_STRING
    keys.forEach((key) => {
      if (!largest || (largest && ans === EMPTY_STRING && diffObject[key])) {
        if (diffObject[key] < 0) {
          ans = `${ans} ${Math.round(diffObject[key]) * -1}${key.charAt(0)}`
        } else {
          ans = `${ans} ${Math.round(diffObject[key])}${key.charAt(0)}`
        }
      }
    })
    return ans.trim() || '0m'
  },
  formatISODate: (
    isoDate: string,
    showMili = true,
    showSeconds = true,
    showTime = true
  ) =>
    `${DateTime.fromISO(isoDate).toLocaleString({
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    })} ${
      showTime
        ? DateTime.fromISO(isoDate).toLocaleString({
            hour: '2-digit',
            minute: '2-digit',
            ...(showSeconds && { second: '2-digit' }),
            ...(showMili && showSeconds && { fractionalSecondDigits: 3 }),
            hourCycle: 'h23'
          })
        : EMPTY_STRING
    }`,
  formatDate: (
    dateIn: DateTime,
    showSeconds = true,
    showMili = true,
    showTime = true
  ) => {
    if (
      !(dateIn instanceof DateTime) &&
      !(Object.getPrototypeOf(dateIn).constructor.name === 'DateTime')
    ) {
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
  },

  capitalize: (str = EMPTY_STRING) => {
    const separator = ', '

    return str
      .split(separator)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(separator)
  },

  debounce: (callback: any, wait = 0) => {
    let timer: ReturnType<typeof setTimeout> | -1 = -1

    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        callback.apply(this, args)
      }, wait)
    }
  },
  closeDialogOnEscape(reason, func) {
    if (reason === 'escapeKeyDown') {
      func()
    }
  },
  closeDialog: () => {
    document.dispatchEvent(new CustomEvent(TOASTER_DIALOG_DISMISS))
  },
  downloadFile(
    content: string | Blob,
    fileName: string,
    type: (typeof MIME_TYPES)[keyof typeof MIME_TYPES] = MIME_TYPES.PLAIN,
    shouldStringify = true
  ) {
    try {
      const formattedContent = shouldStringify
        ? JSON.stringify(content)
        : content
      const downloadLink = document.createElement('a')
      const file = new Blob([formattedContent], { type })
      downloadLink.href = URL.createObjectURL(file)
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.parentNode?.removeChild(downloadLink)
    } catch (e) {
      utils.toastError(DOWNLOAD_FAILED)
    }
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
      return objA
        .toLowerCase()
        .localeCompare(objB.toLowerCase(), undefined, { numeric: true })
    }

    if (typeof objA === 'number' && typeof objB === 'number') {
      return objA - objB
    }

    if (key && utils.isObject(objA) && utils.isObject(objB)) {
      const a = objA[key]
      const b = objB[key]

      if (utils.isString(a) && utils.isString(b)) {
        return a
          .toLowerCase()
          .localeCompare(b.toLowerCase(), undefined, { numeric: true })
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
