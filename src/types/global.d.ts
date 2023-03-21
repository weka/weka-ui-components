export {}

declare global {
  interface Option {
    label: string
    value?: string | number | boolean | string[] | number[] | boolean[]
  }
}
