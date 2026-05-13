/**
 * Utility for measuring chip widths without rendering them in the DOM.
 */

const DEFAULT_CHIP_PADDING = 16
const DEFAULT_CHIP_GAP = 6
const DEFAULT_INPUT_MIN_WIDTH = 150
const DEFAULT_SEARCH_ICON_WIDTH = 24
const DEFAULT_MORE_INDICATOR_WIDTH = 60
const DEFAULT_TYPING_BUFFER = 10
const DEFAULT_CLOSE_BUTTON_WIDTH = 16
const DEFAULT_INTERNAL_GAP_WITH_ICON = 6
const DEFAULT_INTERNAL_GAP_NO_ICON = 0
const DEFAULT_FONT_SIZE = '12px'
const DEFAULT_FONT_FAMILY = "'IBM Plex Sans', Arial, sans-serif"
const DEFAULT_FONT_WEIGHT = '500'

interface ChipMeasurementOptions {
  values: string[]
  containerWidth: number
  maxLines: number
  chipPadding?: number
  chipGap?: number
  iconWidth?: number
  inputMinWidth?: number
  searchIconWidth?: number
  moreIndicatorWidth?: number
  typingBuffer?: number
  fontSize?: string
  fontFamily?: string
  fontWeight?: string
  hasCloseButton?: boolean
  internalGap?: number
  maxChipWidth?: number
}

interface ChipMeasurementResult {
  visibleCount: number
  remainingCount: number
  shouldShowCounter: boolean
}

let measurementCanvas: HTMLCanvasElement | null = null

function getMeasurementCanvas(): HTMLCanvasElement {
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas')
  }
  return measurementCanvas
}

function measureTextWidth(
  text: string,
  fontSize: string,
  fontFamily: string,
  fontWeight: string
): number {
  const canvas = getMeasurementCanvas()
  const context = canvas.getContext('2d')
  if (!context) {
    return 0
  }

  context.font = `${fontWeight} ${fontSize} ${fontFamily}`
  return context.measureText(text).width
}

function resolveInternalGap(
  internalGap: number | undefined,
  iconWidth: number
): number {
  if (internalGap !== undefined) {
    return internalGap
  }
  return iconWidth > 0
    ? DEFAULT_INTERNAL_GAP_WITH_ICON
    : DEFAULT_INTERNAL_GAP_NO_ICON
}

function calculateChipWidth(
  text: string,
  options: ChipMeasurementOptions
): number {
  const {
    chipPadding = DEFAULT_CHIP_PADDING,
    iconWidth = 0,
    fontSize = DEFAULT_FONT_SIZE,
    fontFamily = DEFAULT_FONT_FAMILY,
    fontWeight = DEFAULT_FONT_WEIGHT,
    hasCloseButton = true,
    internalGap,
    maxChipWidth
  } = options

  const textWidth = measureTextWidth(text, fontSize, fontFamily, fontWeight)
  const closeButtonWidth = hasCloseButton ? DEFAULT_CLOSE_BUTTON_WIDTH : 0
  const gap = resolveInternalGap(internalGap, iconWidth)

  const calculatedWidth =
    chipPadding + iconWidth + gap + textWidth + closeButtonWidth

  if (maxChipWidth && calculatedWidth > maxChipWidth) {
    return maxChipWidth
  }

  return calculatedWidth
}

interface FlowParams {
  chipWidths: number[]
  availableWidth: number
  maxLines: number
  chipGap: number
  moreIndicatorWidth?: number
}

/**
 * Walks chip widths line-by-line, stopping when no more chips can fit.
 * Returns how many chips were laid out before stopping.
 *
 * When `moreIndicatorWidth` is provided, the last line reserves space for a "+N" pill.
 */
function countFittingChips({
  chipWidths,
  availableWidth,
  maxLines,
  chipGap,
  moreIndicatorWidth
}: FlowParams): number {
  let currentLineWidth = 0
  let linesUsed = 1
  let fitCount = 0

  for (let i = 0; i < chipWidths.length; i += 1) {
    const totalChipWidth = chipWidths[i] + chipGap
    const isLastLine = linesUsed === maxLines
    const lineLimit =
      isLastLine && moreIndicatorWidth !== undefined
        ? availableWidth - moreIndicatorWidth - chipGap
        : availableWidth

    if (currentLineWidth + totalChipWidth > lineLimit && currentLineWidth > 0) {
      if (linesUsed >= maxLines) {
        return fitCount
      }
      linesUsed += 1
      currentLineWidth = totalChipWidth
      fitCount = i + 1
      continue
    }

    if (currentLineWidth + totalChipWidth <= lineLimit) {
      currentLineWidth += totalChipWidth
      fitCount = i + 1
    } else {
      return fitCount
    }
  }

  return fitCount
}

/**
 * Calculate how many chips can fit in the available space, plus whether a
 * "+N more" counter should be shown.
 */
export function calculateVisibleChips(
  options: ChipMeasurementOptions
): ChipMeasurementResult {
  const {
    values,
    containerWidth,
    maxLines,
    chipGap = DEFAULT_CHIP_GAP,
    inputMinWidth = DEFAULT_INPUT_MIN_WIDTH,
    searchIconWidth = DEFAULT_SEARCH_ICON_WIDTH,
    moreIndicatorWidth = DEFAULT_MORE_INDICATOR_WIDTH,
    typingBuffer = DEFAULT_TYPING_BUFFER
  } = options

  const availableWidth =
    containerWidth - searchIconWidth - inputMinWidth - typingBuffer

  if (values.length === 0 || availableWidth <= 0) {
    return {
      visibleCount: 0,
      remainingCount: 0,
      shouldShowCounter: false
    }
  }

  const chipWidths = values.map((value) => calculateChipWidth(value, options))

  const fitsWithoutCounter = countFittingChips({
    chipWidths,
    availableWidth,
    maxLines,
    chipGap
  })

  if (fitsWithoutCounter >= values.length) {
    return {
      visibleCount: values.length,
      remainingCount: 0,
      shouldShowCounter: false
    }
  }

  const finalCount = countFittingChips({
    chipWidths,
    availableWidth,
    maxLines,
    chipGap,
    moreIndicatorWidth
  })

  const visibleCount = Math.max(1, finalCount)
  const remainingCount = values.length - visibleCount

  return {
    visibleCount,
    remainingCount,
    shouldShowCounter: remainingCount > 0
  }
}
