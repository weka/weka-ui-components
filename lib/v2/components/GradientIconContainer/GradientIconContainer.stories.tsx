import type { Meta, StoryObj } from '@storybook/react'

import { ICON_VARIANTS } from '#v2/utils/consts'

import { FileSystemIcon } from '../../icons'
import {
  GRADIENT_ICON_COLORS,
  GradientIconContainer
} from './GradientIconContainer'

const meta: Meta<typeof GradientIconContainer> = {
  title: 'v2/Icons/GradientIconContainer',
  component: GradientIconContainer,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof GradientIconContainer>

const rowStyle = { display: 'flex', gap: '16px', alignItems: 'center' }
const GLYPH_SIZE = 20
const LARGE_CONTAINER_SIZE = 56
const LARGE_GLYPH_SIZE = 32

const glyph = (size: number) => (
  <FileSystemIcon
    height={size}
    variant={ICON_VARIANTS.SVG_ONLY}
    width={size}
  />
)

export const AllColors: Story = {
  render: () => (
    <div style={rowStyle}>
      {Object.values(GRADIENT_ICON_COLORS).map((color) => (
        <GradientIconContainer
          key={color}
          color={color}
        >
          {glyph(GLYPH_SIZE)}
        </GradientIconContainer>
      ))}
    </div>
  )
}

export const CustomSize: Story = {
  render: () => (
    <GradientIconContainer
      color={GRADIENT_ICON_COLORS.PURPLE}
      height={LARGE_CONTAINER_SIZE}
      width={LARGE_CONTAINER_SIZE}
    >
      {glyph(LARGE_GLYPH_SIZE)}
    </GradientIconContainer>
  )
}
