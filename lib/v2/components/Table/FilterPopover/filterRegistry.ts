import type { ReactNode } from 'react'

/** Render context handed to a custom (domain) filter by FilterPopover */
export interface CustomFilterContext<V> {
  value: V
  onChange: (next: V) => void
  modeLabels?: { used?: string; total?: string }
}

/** The chip representation of a custom filter's value, shown by FilterChips */
export interface CustomFilterChip {
  /** overrides the chip's left-hand label (e.g. "Capacity (Used)") */
  label?: string
  /** the chip's value text (e.g. "10 GB - 20 GB") */
  display: string
}

/**
 * Defines how a custom (consumer-supplied, domain-specific) filter integrates
 * with the generic FilterPopover: its default value, body UI, emptiness check
 * (cleared on apply when empty), and optional apply-disabled validation message.
 */
export interface CustomFilterDefinition<V = unknown> {
  getDefaultValue: () => V
  render: (ctx: CustomFilterContext<V>) => ReactNode
  isEmpty: (value: V) => boolean
  validate?: (value: V) => string
  /** Formats the value as a chip for FilterChips (defaults to a plain string) */
  formatChip?: (
    value: V,
    modeLabels?: { used?: string; total?: string }
  ) => CustomFilterChip
}

/** Registry mapping a FilterType to its custom filter definition */
export type CustomFilters = Record<string, CustomFilterDefinition>
