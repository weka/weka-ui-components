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

/**
 * Builds X-axis configuration object by extracting relevant properties
 * from extended config. Only includes properties that are defined.
 */
export function buildXAxisConfig(
  xAxis: XAxisExtendedConfig | undefined
): AxisConfig {
  const config: AxisConfig = {}

  if (xAxis?.dataKey) {
    config.dataKey = xAxis.dataKey
  }
  if (xAxis?.height) {
    config.height = xAxis.height
  }
  if (xAxis?.tick) {
    config.tick = xAxis.tick
  }
  if (xAxis?.ticks !== undefined) {
    config.ticks = xAxis.ticks
  }
  if (xAxis?.tickMargin !== undefined) {
    config.tickMargin = xAxis.tickMargin
  }
  if (xAxis?.tickFormatter) {
    config.tickFormatter = xAxis.tickFormatter
  }
  if (xAxis?.interval !== undefined) {
    config.interval = xAxis.interval
  }
  if (xAxis?.type) {
    config.type = xAxis.type
  }
  if (xAxis?.hide !== undefined) {
    config.hide = xAxis.hide
  }

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
