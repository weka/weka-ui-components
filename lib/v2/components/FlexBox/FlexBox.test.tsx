import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { EMPTY_STRING } from '../../utils/consts'
import { FlexBox } from './FlexBox'

describe('FlexBox', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <FlexBox>
          <span>Child content</span>
        </FlexBox>
      )
      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('renders with default flex styles', () => {
      const { container } = render(<FlexBox>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap'
      })
    })

    it('applies extraClass when provided', () => {
      const { container } = render(
        <FlexBox extraClass='custom-class'>Content</FlexBox>
      )
      const element = container.firstChild as HTMLElement
      expect(element.className).toBe('custom-class')
    })
  })

  describe('Direction', () => {
    it('renders with row direction by default', () => {
      const { container } = render(<FlexBox>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ flexDirection: 'row' })
    })

    it('renders with column direction when specified', () => {
      const { container } = render(
        <FlexBox direction='column'>Content</FlexBox>
      )
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ flexDirection: 'column' })
    })
  })

  describe('Gap', () => {
    it('renders without gap by default', () => {
      const { container } = render(<FlexBox>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element.style.gap).toBe(EMPTY_STRING)
    })

    it('renders with numeric gap (converted to px)', () => {
      const { container } = render(<FlexBox gap={16}>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ gap: '16px' })
    })

    it('renders with string gap', () => {
      const { container } = render(<FlexBox gap='1rem'>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ gap: '1rem' })
    })
  })

  describe('Alignment', () => {
    it.each([
      { align: 'flex-start' as const, expected: 'flex-start' },
      { align: 'center' as const, expected: 'center' },
      { align: 'flex-end' as const, expected: 'flex-end' },
      { align: 'stretch' as const, expected: 'stretch' }
    ])('renders with align="$align"', ({ align, expected }) => {
      const { container } = render(<FlexBox align={align}>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ alignItems: expected })
    })
  })

  describe('Justification', () => {
    it.each([
      { justify: 'flex-start' as const },
      { justify: 'center' as const },
      { justify: 'flex-end' as const },
      { justify: 'space-between' as const },
      { justify: 'space-around' as const },
      { justify: 'space-evenly' as const }
    ])('renders with justify="$justify"', ({ justify }) => {
      const { container } = render(<FlexBox justify={justify}>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ justifyContent: justify })
    })
  })

  describe('Wrap', () => {
    it('renders with nowrap by default', () => {
      const { container } = render(<FlexBox>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ flexWrap: 'nowrap' })
    })

    it('renders with wrap when wrap=true', () => {
      const { container } = render(<FlexBox wrap>Content</FlexBox>)
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ flexWrap: 'wrap' })
    })
  })

  describe('Custom Style', () => {
    it('applies custom style prop', () => {
      const { container } = render(
        <FlexBox style={{ padding: '20px', margin: '10px' }}>Content</FlexBox>
      )
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({
        padding: '20px',
        margin: '10px'
      })
    })

    it('preserves flex styles when custom style is applied', () => {
      const { container } = render(
        <FlexBox
          direction='column'
          gap={8}
          style={{ backgroundColor: 'red' }}
        >
          Content
        </FlexBox>
      )
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: 'red'
      })
    })

    it('allows custom style to override flex defaults', () => {
      const { container } = render(
        <FlexBox style={{ display: 'inline-flex' }}>Content</FlexBox>
      )
      const element = container.firstChild as HTMLElement
      expect(element).toHaveStyle({ display: 'inline-flex' })
    })
  })

  describe('Combined Props', () => {
    it('renders correctly with all props combined', () => {
      const { container } = render(
        <FlexBox
          direction='column'
          gap={24}
          align='stretch'
          justify='space-between'
          wrap
          extraClass='test-class'
          style={{ maxWidth: '500px' }}
        >
          <span>Child 1</span>
          <span>Child 2</span>
        </FlexBox>
      )
      const element = container.firstChild as HTMLElement

      expect(element.className).toBe('test-class')
      expect(element).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        maxWidth: '500px'
      })
      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
    })
  })
})
