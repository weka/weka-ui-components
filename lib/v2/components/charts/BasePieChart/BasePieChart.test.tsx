import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BasePieChart, type PieChartDataItem } from './BasePieChart'

const { cellMock } = vi.hoisted(() => ({ cellMock: vi.fn() }))

vi.mock('../StableChartContainer', () => ({
  StableChartContainer: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children
}))

vi.mock('recharts', () => ({
  Cell: (props: Readonly<{ fill?: string }>) => {
    cellMock(props)
    return null
  },
  Pie: ({ children }: Readonly<{ children?: ReactNode }>) => children ?? null,
  PieChart: ({ children }: Readonly<{ children?: ReactNode }>) =>
    children ?? null,
  Tooltip: () => null
}))

const DATA: PieChartDataItem[] = [
  { name: 'NFS', value: 60 },
  { name: 'SMB', value: 40 }
]

describe('BasePieChart', () => {
  beforeEach(() => {
    cellMock.mockClear()
  })

  it('renders the loading state when isLoading', () => {
    render(
      <BasePieChart
        data={DATA}
        isLoading
      />
    )

    expect(screen.getByTestId('loading-state')).toBeInTheDocument()
    expect(cellMock).not.toHaveBeenCalled()
  })

  it('renders the error state when isError', () => {
    render(
      <BasePieChart
        data={DATA}
        isError
      />
    )

    expect(screen.getByTestId('error-state')).toBeInTheDocument()
  })

  it('renders the empty chart state when noData', () => {
    render(
      <BasePieChart
        data={DATA}
        noData
      />
    )

    expect(screen.getByText('No Current Data')).toBeInTheDocument()
    expect(cellMock).not.toHaveBeenCalled()
  })

  it('renders a cell per datum with the default fill', () => {
    render(<BasePieChart data={DATA} />)

    expect(cellMock).toHaveBeenCalledTimes(DATA.length)
    cellMock.mock.calls.forEach(([cellProps]) => {
      expect(cellProps).toMatchObject({ fill: 'var(--blue-500)' })
    })
  })

  it('fills cells from the provided gradients', () => {
    const { container } = render(
      <BasePieChart
        data={DATA}
        gradients={[
          {
            id: 'pie-gradient-nfs',
            element: <linearGradient id='pie-gradient-nfs' />
          },
          {
            id: 'pie-gradient-smb',
            element: <linearGradient id='pie-gradient-smb' />
          }
        ]}
      />
    )

    expect(cellMock).toHaveBeenCalledWith(
      expect.objectContaining({ fill: 'url(#pie-gradient-nfs)' })
    )
    expect(cellMock).toHaveBeenCalledWith(
      expect.objectContaining({ fill: 'url(#pie-gradient-smb)' })
    )
    expect(container.querySelector('#pie-gradient-nfs')).toBeInTheDocument()
  })

  it('removes the slice stroke when there is a single datum', () => {
    render(<BasePieChart data={[DATA[0]]} />)

    expect(cellMock).toHaveBeenCalledWith(
      expect.objectContaining({ stroke: 'none', strokeWidth: 0 })
    )
  })
})
