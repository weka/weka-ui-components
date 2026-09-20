import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  GRADIENT_ICON_COLORS,
  GradientIconContainer
} from './GradientIconContainer'
import {
  GRADIENT_ICON_CONTAINER_SIZE,
  scaleGlyphToContainer
} from './scaleGlyphToContainer'

const CHILD_TEXT = 'glyph'
const CUSTOM_SIZE = 48
const CUSTOM_CLASS = 'custom-class'
const REFERENCE_GLYPH_SIZE = 22
const HALF_CONTAINER_SIZE = GRADIENT_ICON_CONTAINER_SIZE / 2
const GLYPH_SIZE_AT_HALF = REFERENCE_GLYPH_SIZE / 2

const renderContainer = (props = {}) =>
  render(
    <GradientIconContainer
      color={GRADIENT_ICON_COLORS.PURPLE}
      {...props}
    >
      <span>{CHILD_TEXT}</span>
    </GradientIconContainer>
  )

describe('GradientIconContainer', () => {
  it('renders its children', () => {
    renderContainer()
    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument()
  })

  it('renders at the 36px reference size by default', () => {
    renderContainer()
    const container = screen.getByText(CHILD_TEXT).parentElement
    expect(container).toHaveStyle({
      width: `${GRADIENT_ICON_CONTAINER_SIZE}px`,
      height: `${GRADIENT_ICON_CONTAINER_SIZE}px`
    })
  })

  it('renders at a custom size', () => {
    renderContainer({ width: CUSTOM_SIZE, height: CUSTOM_SIZE })
    const container = screen.getByText(CHILD_TEXT).parentElement
    expect(container).toHaveStyle({
      width: `${CUSTOM_SIZE}px`,
      height: `${CUSTOM_SIZE}px`
    })
  })

  it.each(Object.values(GRADIENT_ICON_COLORS))(
    'exposes the %s color variant',
    (color) => {
      renderContainer({ color })
      const container = screen.getByText(CHILD_TEXT).parentElement
      expect(container).toHaveAttribute('data-color', color)
    }
  )

  it('applies an extra class', () => {
    renderContainer({ extraClass: CUSTOM_CLASS })
    expect(screen.getByText(CHILD_TEXT).parentElement).toHaveClass(CUSTOM_CLASS)
  })
})

describe('scaleGlyphToContainer', () => {
  it('returns the glyph size unchanged at the reference container size', () => {
    expect(
      scaleGlyphToContainer(REFERENCE_GLYPH_SIZE, GRADIENT_ICON_CONTAINER_SIZE)
    ).toBe(REFERENCE_GLYPH_SIZE)
  })

  it('scales the glyph proportionally to the container size', () => {
    expect(
      scaleGlyphToContainer(REFERENCE_GLYPH_SIZE, HALF_CONTAINER_SIZE)
    ).toBe(GLYPH_SIZE_AT_HALF)
  })
})
