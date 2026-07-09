export const CHART_COLORS = {
  AXIS_STROKE: 'var(--gray-650-350)',
  GRID_STROKE: 'var(--gray-300-700)'
} as const

export const CHART_COLOR_SCHEME = [
  'blue',
  'aqua',
  'fuchsia',
  'peach',
  'yellow',
  'green',
  'red',
  'cyan',
  'orange',
  'purple'
] as const

export type ChartColorScheme = (typeof CHART_COLOR_SCHEME)[number]

export const CHART_COLOR_VARS = {
  blue: 'var(--blue-500)',
  aqua: 'var(--aqua-500)',
  peach: 'var(--peach-500)',
  fuchsia: 'var(--fuchsia-500)',
  purple: 'var(--purple-500)',
  yellow: 'var(--yellow-500)',
  green: 'var(--green-500)',
  red: 'var(--red-500)',
  cyan: 'var(--cyan-500)',
  orange: 'var(--orange-500)',
  teal: 'var(--teal-500)',
  violet: 'var(--violet-500)',
  brown: 'var(--brown-500)',
  acidGreen: 'var(--acid-green-500)',
  redRose: 'var(--red-rose-500)'
} as const
