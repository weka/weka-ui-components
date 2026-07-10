import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatBox } from './StatBox'

describe('StatBox', () => {
  describe('Rendering', () => {
    it('renders the title and main value', () => {
      render(
        <StatBox
          colorVariant='fuchsia'
          mainValue='1.2'
          title='Usable Capacity'
        />
      )
      expect(screen.getByText('Usable Capacity')).toBeInTheDocument()
      expect(screen.getByText('1.2')).toBeInTheDocument()
    })

    it('renders the main unit when provided', () => {
      render(
        <StatBox
          colorVariant='fuchsia'
          mainUnit='TB'
          mainValue='1.2'
          title='Usable Capacity'
        />
      )
      expect(screen.getByText('TB')).toBeInTheDocument()
    })

    it('renders each sub-stat label, value and unit', () => {
      render(
        <StatBox
          colorVariant='cyan'
          mainUnit='MB/s'
          mainValue='146.8'
          subStats={[{ label: 'Read', value: '132.0', unit: 'MB/s' }]}
          title='Throughput'
        />
      )
      expect(screen.getByText('Read')).toBeInTheDocument()
      expect(screen.getByText('132.0')).toBeInTheDocument()
    })

    it('renders the main value adornment next to the main value', () => {
      render(
        <StatBox
          colorVariant='purple'
          mainValue={11}
          mainValueAdornment={<button type='button'>7 Stale</button>}
          title='Clusters'
        />
      )
      expect(
        screen.getByRole('button', { name: '7 Stale' })
      ).toBeInTheDocument()
    })

    it('renders no sub-stats when the list is empty', () => {
      render(
        <StatBox
          colorVariant='peach'
          mainValue={64}
          subStats={[]}
          title='Clients'
        />
      )
      expect(screen.queryByText('Active')).not.toBeInTheDocument()
    })
  })

  describe('Status', () => {
    it('renders the loading skeleton instead of content', () => {
      render(
        <StatBox
          colorVariant='cyan'
          mainValue='146.8'
          status='loading'
          title='Throughput'
        />
      )
      expect(
        screen.getByTestId('stat-box-skeleton-loading')
      ).toBeInTheDocument()
      expect(screen.queryByText('146.8')).not.toBeInTheDocument()
    })

    it('renders the error skeleton instead of content', () => {
      render(
        <StatBox
          colorVariant='aqua'
          mainValue='732.4K'
          status='error'
          title='IOPS'
        />
      )
      expect(screen.getByTestId('stat-box-skeleton-error')).toBeInTheDocument()
    })
  })

  describe('Test ids', () => {
    it('applies the stat-box data-testid', () => {
      render(
        <StatBox
          colorVariant='peach'
          dataTestId='clients'
          mainValue={64}
          title='Clients'
        />
      )
      expect(screen.getByTestId('stat-box-clients')).toBeInTheDocument()
    })
  })
})
