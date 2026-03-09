import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { LoadingState } from './LoadingState'

describe('LoadingState', () => {
  describe('Loading State', () => {
    it('renders loading state with default message', () => {
      render(<LoadingState type='loading' />)
      expect(screen.getByTestId('loading-state')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders loading state with custom message', () => {
      render(
        <LoadingState
          message='Fetching data...'
          type='loading'
        />
      )
      expect(screen.getByText('Fetching data...')).toBeInTheDocument()
    })

    it('renders spinner for loading state', () => {
      const { container } = render(<LoadingState type='loading' />)
      const spinnerDots = container.querySelectorAll('[class*="spinnerDot"]')
      expect(spinnerDots.length).toBe(4)
    })
  })

  describe('Error State', () => {
    it('renders error state with default message', () => {
      render(<LoadingState type='error' />)
      expect(screen.getByTestId('error-state')).toBeInTheDocument()
      expect(screen.getByText('Error loading data')).toBeInTheDocument()
    })

    it('renders error state with custom message', () => {
      render(
        <LoadingState
          message='Something went wrong'
          type='error'
        />
      )
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('does not render spinner for error state', () => {
      const { container } = render(<LoadingState type='error' />)
      const spinnerDots = container.querySelectorAll('[class*="spinnerDot"]')
      expect(spinnerDots.length).toBe(0)
    })
  })

  describe('No Data State', () => {
    it('renders noData state with default message', () => {
      render(<LoadingState type='noData' />)
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('renders noData state with custom message', () => {
      render(
        <LoadingState
          message='No items found'
          type='noData'
        />
      )
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })

    it('does not render spinner for noData state', () => {
      const { container } = render(<LoadingState type='noData' />)
      const spinnerDots = container.querySelectorAll('[class*="spinnerDot"]')
      expect(spinnerDots.length).toBe(0)
    })
  })

  describe('Children', () => {
    it('renders children content', () => {
      render(
        <LoadingState type='error'>
          <button type='button'>Retry</button>
        </LoadingState>
      )
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })

    it('renders children alongside message', () => {
      render(
        <LoadingState
          message='Failed to load'
          type='error'
        >
          <span>Click below to retry</span>
        </LoadingState>
      )
      expect(screen.getByText('Failed to load')).toBeInTheDocument()
      expect(screen.getByText('Click below to retry')).toBeInTheDocument()
    })
  })

  describe('CSS Classes', () => {
    it('applies loading class for loading type', () => {
      const { container } = render(<LoadingState type='loading' />)
      const stateContainer = container.firstChild as HTMLElement
      expect(stateContainer.className).toContain('loading')
    })

    it('applies error class for error type', () => {
      const { container } = render(<LoadingState type='error' />)
      const stateContainer = container.firstChild as HTMLElement
      expect(stateContainer.className).toContain('error')
    })

    it('applies noData class for noData type', () => {
      const { container } = render(<LoadingState type='noData' />)
      const stateContainer = container.firstChild as HTMLElement
      expect(stateContainer.className).toContain('noData')
    })
  })
})
