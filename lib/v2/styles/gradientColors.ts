export const GRADIENT_COLORS = {
  red: {
    start: '#A61919',
    end: '#F24949'
  },
  green: {
    start: '#268033',
    end: '#59B267'
  },
  orange: {
    start: '#BF6B00',
    end: '#FFAB40'
  },
  yellow: {
    start: '#CCB429',
    end: '#FFE866'
  },
  gray: {
    start: '#576473',
    end: '#8594A6'
  },
  cyan: {
    start: '#1B71B2',
    end: '#45A0E5'
  },
  purple: {
    start: '#6302BD',
    end: '#9D41F1'
  },
  fuchsia: {
    start: '#BC269B',
    end: '#F042CA'
  },
  aqua: {
    start: '#1F6566',
    end: '#4D9899'
  },
  aubergine: {
    start: '#413366',
    end: '#3A185A'
  },
  redLight: {
    start: '#F24949',
    end: '#FF9999'
  },
  greenLight: {
    start: '#59B267',
    end: '#8FCC98'
  },
  orangeLight: {
    start: '#FFAB40',
    end: '#FFCD8C'
  },
  yellowLight: {
    start: '#FFE866',
    end: '#FFF099'
  },
  grayLight: {
    start: '#8594A6',
    end: '#BDCAD9'
  },
  cyanLight: {
    start: '#45A0E5',
    end: '#80C8FF'
  },
  purpleLight: {
    start: '#9D41F1',
    end: '#CEA1F7'
  },
  fuchsiaLight: {
    start: '#F042CA',
    end: '#F8A0E5'
  },
  aquaLight: {
    start: '#4D9899',
    end: '#7ACBCC'
  },
  aubergineLight: {
    start: '#726399',
    end: '#AEA3CC'
  },
  backupGreen: {
    start: '#3D994B',
    end: '#6BB276'
  },
  backupOrange: {
    start: '#E58B17',
    end: '#FFBC66'
  },
  backupGray: {
    start: '#6D7C8C',
    end: '#A3B0BF'
  },
  backupRed: {
    start: '#E52E2E',
    end: '#FF7373'
  }
} as const

export type GradientColorKey = keyof typeof GRADIENT_COLORS

export interface GradientColors {
  start: string
  end: string
}

export const getGradientColors = (color: GradientColorKey): GradientColors =>
  GRADIENT_COLORS[color]

export const createGradientId = (prefix: string, identifier: string): string =>
  `${prefix}Gradient-${identifier.toLowerCase()}`
