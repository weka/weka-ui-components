import type { XAxisExtendedConfig, YAxisExtendedConfig } from '../chartTypes'

import { CHART_COLORS } from '../chartConstants'

type AxisConfig = Record<string, unknown>

const DEFAULT_AXIS_FONT_SIZE = 10
const DEFAULT_Y_AXIS_WIDTH = 90

/**
 * Resolves the shared X-axis style props (font size, stroke and axis line),
 * falling back to the chart defaults for anything the config leaves out.
 */
export function buildXAxisStyleProps(xAxis: XAxisExtendedConfig | undefined) {
  const stroke = xAxis?.stroke ?? CHART_COLORS.AXIS_STROKE
  return {
    stroke,
    fontSize: xAxis?.fontSize ?? DEFAULT_AXIS_FONT_SIZE,
    axisLine: { stroke, strokeWidth: xAxis?.strokeWidth ?? 1 }
  }
}

/**
 * Resolves the shared Y-axis style props (font size, stroke, width and axis
 * line), falling back to the chart defaults for anything the config leaves out.
 */
export function buildYAxisStyleProps(yAxis: YAxisExtendedConfig | undefined) {
  const stroke = yAxis?.stroke ?? CHART_COLORS.AXIS_STROKE
  return {
    stroke,
    fontSize: yAxis?.fontSize ?? DEFAULT_AXIS_FONT_SIZE,
    width: yAxis?.width ?? DEFAULT_Y_AXIS_WIDTH,
    axisLine: { stroke, strokeWidth: yAxis?.strokeWidth ?? 1 }
  }
}

/*
 * Keys copied only when truthy, and keys copied whenever defined (so zero
 * values like `tickMargin: 0` and `interval: 0` survive).
 */
const X_AXIS_TRUTHY_KEYS = [
  'dataKey',
  'height',
  'tick',
  'tickFormatter',
  'type',
  'padding'
] as const
const X_AXIS_DEFINED_KEYS = ['ticks', 'tickMargin', 'interval', 'hide'] as const

/**
 * Builds X-axis configuration object by extracting relevant properties
 * from extended config. Only includes properties that are defined. Spread
 * after the chart's own XAxis props, so anything here (e.g. `padding`)
 * overrides the chart default.
 */
export function buildXAxisConfig(
  xAxis: XAxisExtendedConfig | undefined
): AxisConfig {
  const config: AxisConfig = {}
  if (!xAxis) {
    return config
  }
  X_AXIS_TRUTHY_KEYS.forEach((key) => {
    if (xAxis[key]) {
      config[key] = xAxis[key]
    }
  })
  X_AXIS_DEFINED_KEYS.forEach((key) => {
    if (xAxis[key] !== undefined) {
      config[key] = xAxis[key]
    }
  })

  return config
}

/**
 * Builds Y-axis configuration object by extracting relevant properties
 * from extended config. Only includes properties that are defined.
 */
export function buildYAxisConfig(
  yAxis: YAxisExtendedConfig | undefined
): AxisConfig {
  const config: AxisConfig = {}

  if (yAxis?.tickFormatter) {
    config.tickFormatter = yAxis.tickFormatter
  }
  if (yAxis?.includeHidden !== undefined) {
    config.includeHidden = yAxis.includeHidden
  }
  if (yAxis?.hide !== undefined) {
    config.hide = yAxis.hide
  }
  if (yAxis?.tick) {
    config.tick = yAxis.tick
  }
  if (yAxis?.tickSize !== undefined) {
    config.tickSize = yAxis.tickSize
  }
  if (yAxis?.padding) {
    config.padding = yAxis.padding
  }
  if (yAxis?.label) {
    config.label = yAxis.label
  }

  return config
}
