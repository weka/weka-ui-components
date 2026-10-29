import type { ReactElement } from 'react'

export {}

/** Shorter label and tooltip for the chip of a selected option in a multi-select */
interface ChipFields {
  chipLabel: string | ReactElement
  chipTooltip: string | ReactElement
}

declare global {
  interface Option extends Partial<ChipFields> {
    label: string
    value?: string | number | boolean | string[] | number[] | boolean[]
    icon?: React.ReactNode
    tooltip?: string
    subLabel?: string
  }

  interface Filter {
    id: string
    value:
      | Array<string | boolean>
      | string
      | boolean
      | Record<string, string | boolean>
  }

  interface ExtendedFilter extends Filter {
    defaultFilter?: boolean
  }
}
