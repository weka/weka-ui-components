export {}

declare global {
  interface Option {
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
