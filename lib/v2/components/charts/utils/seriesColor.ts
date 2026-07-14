import { CHART_COLOR_VARS } from '../chartConstants'

const GRADIENT_COLOR_REGEX = /gradient-(\w+)-fade/

/**
 * Resolves a series `color` to a solid CSS color usable outside an SVG `fill`
 * context — e.g. a legend swatch's `background-color` or an area's stroke.
 *
 * Gradient fill references (`url(#gradient-<name>-fade…)`) render nothing when
 * assigned to a DOM `background-color`, so they map to their base
 * `--<name>-500` token. Any already-solid color is returned unchanged.
 */
export function resolveSeriesColor(color: string): string {
  if (!color.startsWith('url(#gradient-')) {
    return color
  }
  const match = GRADIENT_COLOR_REGEX.exec(color)
  if (match?.[1]) {
    const colorName = match[1] as keyof typeof CHART_COLOR_VARS
    return CHART_COLOR_VARS[colorName] ?? color
  }
  return color
}
