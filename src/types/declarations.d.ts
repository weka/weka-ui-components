import { AriaAttributes, DOMAttributes } from 'react'
import {
  UseFiltersInstanceProps,
  UseFiltersOptions, UseFiltersState, UseGlobalFiltersInstanceProps, UseGlobalFiltersOptions, UseGlobalFiltersState,
  UsePaginationOptions,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState
} from 'react-table'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    disabled?: boolean
    emptymessage?: string
  }
}

declare module 'react-table' {
  export interface TableOptions<D extends Record<string, unknown>> extends UsePaginationOptions<D>,
    UseSortByOptions<D>,
    UseFiltersOptions<D>,
    UseGlobalFiltersOptions<D>,
    Record<string, any> {
  }
  export interface TableState<D extends Record<string, unknown> = Record<string, unknown>> extends
    UsePaginationState<D>, UseSortByState<D>, UseFiltersState<D>, UseGlobalFiltersState<D> {}

  export interface TableInstance<D extends Record<string, unknown> = Record<string, unknown>> extends
    UsePaginationInstanceProps<D>, UseSortByInstanceProps<D>, UseFiltersInstanceProps<D>, UseGlobalFiltersInstanceProps<D> {}
}
