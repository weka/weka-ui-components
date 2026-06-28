// Gradient color definitions aligned with colors.scss — keep the `$token`
// comments in sync so drift from the palette stays easy to spot.
export const GRADIENT_COLORS = {
  // Standard gradients (600 → 400)
  red: {
    start: '#A61919', // $red-600
    end: '#F24949' // $red-400
  },
  green: {
    start: '#268033', // $green-600
    end: '#59B267' // $green-400
  },
  orange: {
    start: '#CC7200', // $orange-600
    end: '#FFAB40' // $orange-400
  },
  yellow: {
    start: '#E5C717', // $yellow-600
    end: '#FFEA73' // $yellow-400
  },
  gray: {
    start: '#576473', // $gray-600
    end: '#8594A6' // $gray-400
  },
  cyan: {
    start: '#1B71B2', // $cyan-600
    end: '#45A0E5' // $cyan-400
  },
  purple: {
    start: '#6302BD', // $purple-600
    end: '#9D41F1' // $purple-400
  },
  fuchsia: {
    start: '#BC269B', // $fuchsia-600
    end: '#F042CA' // $fuchsia-400
  },
  aqua: {
    start: '#0F9299', // $aqua-600
    end: '#14C3CC' // $aqua-400
  },
  aubergine: {
    start: '#413366', // $aubergine-600
    end: '#3A185A' // $aubergine-400
  },

  // Light gradients (400 → 200)
  redLight: {
    start: '#F24949', // $red-400
    end: '#FF9999' // $red-200
  },
  greenLight: {
    start: '#59B267', // $green-400
    end: '#8FCC98' // $green-200
  },
  orangeLight: {
    start: '#FFAB40', // $orange-400
    end: '#FFCD8C' // $orange-200
  },
  yellowLight: {
    start: '#FFEA73', // $yellow-400
    end: '#FFF2A6' // $yellow-200
  },
  grayLight: {
    start: '#8594A6', // $gray-400
    end: '#BDCAD9' // $gray-200
  },
  cyanLight: {
    start: '#45A0E5', // $cyan-400
    end: '#80C8FF' // $cyan-200
  },
  purpleLight: {
    start: '#9D41F1', // $purple-400
    end: '#CEA1F7' // $purple-200
  },
  fuchsiaLight: {
    start: '#F042CA', // $fuchsia-400
    end: '#F8A0E5' // $fuchsia-200
  },
  aquaLight: {
    start: '#14C3CC', // $aqua-400
    end: '#30E9F2' // $aqua-200
  },
  aubergineLight: {
    start: '#3A185A', // $aubergine-400
    end: '#AEA3CC' // $aubergine-200
  },

  // Backup-server specific gradients (500 → 300)
  backupGreen: {
    start: '#3D994B', // $green-500
    end: '#6BB276' // $green-300
  },
  backupOrange: {
    start: '#EB8C13', // $orange-500
    end: '#FFBC66' // $orange-300
  },
  backupGray: {
    start: '#6D7C8C', // $gray-500
    end: '#A3B0BF' // $gray-300
  },
  backupRed: {
    start: '#E52E2E', // $red-500
    end: '#FF7373' // $red-300
  }
} as const

export type GradientColorKey = keyof typeof GRADIENT_COLORS

export interface GradientColors {
  start: string
  end: string
}

/** Get gradient colors by color name. */
export const getGradientColors = (color: GradientColorKey): GradientColors =>
  GRADIENT_COLORS[color]

/** Create a unique gradient ID for SVG usage. */
export const createGradientId = (prefix: string, identifier: string): string =>
  `${prefix}Gradient-${identifier.toLowerCase()}`
