import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MiniPagination } from './MiniPagination'

const PREV_LABEL = 'Previous page'
const NEXT_LABEL = 'Next page'

describe('MiniPagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPrevPage: vi.fn(),
    onNextPage: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders previous and next buttons', () => {
      render(<MiniPagination {...defaultProps} />)

      expect(
        screen.getByRole('button', { name: PREV_LABEL })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: NEXT_LABEL })
      ).toBeInTheDocument()
    })

    it('applies container class', () => {
      const { container } = render(<MiniPagination {...defaultProps} />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper.className).toContain('container')
    })
  })

  describe('Disabled States', () => {
    it('disables previous button on first page', () => {
      render(
        <MiniPagination
          {...defaultProps}
          currentPage={0}
        />
      )

      expect(screen.getByRole('button', { name: PREV_LABEL })).toBeDisabled()
    })

    it('disables next button on last page', () => {
      render(
        <MiniPagination
          {...defaultProps}
          currentPage={4}
        />
      )

      expect(screen.getByRole('button', { name: NEXT_LABEL })).toBeDisabled()
    })

    it('enables both buttons on middle page', () => {
      render(
        <MiniPagination
          {...defaultProps}
          currentPage={2}
        />
      )

      expect(screen.getByRole('button', { name: PREV_LABEL })).toBeEnabled()
      expect(screen.getByRole('button', { name: NEXT_LABEL })).toBeEnabled()
    })

    it('disables both buttons when totalPages is 1', () => {
      render(
        <MiniPagination
          {...defaultProps}
          currentPage={0}
          totalPages={1}
        />
      )

      expect(screen.getByRole('button', { name: PREV_LABEL })).toBeDisabled()
      expect(screen.getByRole('button', { name: NEXT_LABEL })).toBeDisabled()
    })
  })

  describe('User Interactions', () => {
    it('calls onPrevPage when previous button is clicked', () => {
      const handlePrev = vi.fn()
      render(
        <MiniPagination
          {...defaultProps}
          onPrevPage={handlePrev}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: PREV_LABEL }))

      expect(handlePrev).toHaveBeenCalledTimes(1)
    })

    it('calls onNextPage when next button is clicked', () => {
      const handleNext = vi.fn()
      render(
        <MiniPagination
          {...defaultProps}
          onNextPage={handleNext}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: NEXT_LABEL }))

      expect(handleNext).toHaveBeenCalledTimes(1)
    })
  })
})
