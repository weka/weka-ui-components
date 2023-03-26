export {}

declare global {
  interface Option {
    label: string
    value?: string | number | boolean | string[] | number[] | boolean[]
  }

  interface Filter {
    id: string
    value:
      | Array<string | boolean>
      | string
      | boolean
      | Record<string, string | boolean>
  }
}
