/**
 * Reference size the metric icon glyphs were designed against; glyph sizes
 * scale proportionally when the container is rendered at another size.
 */
export const GRADIENT_ICON_CONTAINER_SIZE = 36

export function scaleGlyphToContainer(
  glyphSize: number,
  containerSize: number
) {
  return Math.round((glyphSize * containerSize) / GRADIENT_ICON_CONTAINER_SIZE)
}
