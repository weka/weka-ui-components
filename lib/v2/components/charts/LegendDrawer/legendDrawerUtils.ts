export const DEFAULT_CONTAINER_WIDTH = 600

const DRAWER_CONTAINER_BREAKPOINTS = {
  VERY_NARROW: 350,
  NARROW: 450,
  MEDIUM: 600
} as const

const DRAWER_MAX_WIDTH_RATIOS = {
  VERY_NARROW: 0.35,
  NARROW: 0.4,
  MEDIUM: 0.45,
  LARGE: 0.5
} as const

const DRAWER_BASE_WIDTHS = {
  VERY_NARROW: 100,
  NARROW: 110,
  MEDIUM: 120,
  LARGE: 130
} as const

const DRAWER_VALUE_ADDITIONS = {
  VERY_NARROW: 40,
  NARROW: 60,
  MEDIUM: 80,
  LARGE: 100
} as const

const getDrawerMaxWidthRatio = (containerWidth: number): number => {
  if (containerWidth <= DRAWER_CONTAINER_BREAKPOINTS.VERY_NARROW) {
    return DRAWER_MAX_WIDTH_RATIOS.VERY_NARROW
  }
  if (containerWidth <= DRAWER_CONTAINER_BREAKPOINTS.NARROW) {
    return DRAWER_MAX_WIDTH_RATIOS.NARROW
  }
  if (containerWidth <= DRAWER_CONTAINER_BREAKPOINTS.MEDIUM) {
    return DRAWER_MAX_WIDTH_RATIOS.MEDIUM
  }
  return DRAWER_MAX_WIDTH_RATIOS.LARGE
}

export const getDrawerDefaultWidth = (
  containerWidth: number,
  showValues: boolean
): number => {
  const hasValues = showValues ? 1 : 0

  if (containerWidth <= DRAWER_CONTAINER_BREAKPOINTS.VERY_NARROW) {
    return (
      DRAWER_BASE_WIDTHS.VERY_NARROW +
      hasValues * DRAWER_VALUE_ADDITIONS.VERY_NARROW
    )
  } else if (containerWidth <= DRAWER_CONTAINER_BREAKPOINTS.NARROW) {
    return DRAWER_BASE_WIDTHS.NARROW + hasValues * DRAWER_VALUE_ADDITIONS.NARROW
  } else if (containerWidth <= DRAWER_CONTAINER_BREAKPOINTS.MEDIUM) {
    return DRAWER_BASE_WIDTHS.MEDIUM + hasValues * DRAWER_VALUE_ADDITIONS.MEDIUM
  } else {
    return DRAWER_BASE_WIDTHS.LARGE + hasValues * DRAWER_VALUE_ADDITIONS.LARGE
  }
}

export const getScaledDrawerWidth = (
  containerWidth: number,
  customDefaultWidth: number,
  showValues: boolean
): number => {
  const calculatedWidth = getDrawerDefaultWidth(containerWidth, showValues)
  const maxWidthRatio = getDrawerMaxWidthRatio(containerWidth)
  const maxContainerWidth = Math.floor(containerWidth * maxWidthRatio)
  return Math.min(
    customDefaultWidth,
    Math.max(maxContainerWidth, calculatedWidth)
  )
}
