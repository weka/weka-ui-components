import type { TopConsumersColumn } from './types'

import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TOP_CONSUMERS_METRICS } from './topConsumersConsts'
import { TopConsumersWidget } from './TopConsumersWidget'

const WIDGET_TEST_ID = 'top-consumers'
const CUSTOM_GRADIENT = { start: 'rgb(1, 2, 3)', end: 'rgb(4, 5, 6)' }
const SMALL = 1
const MEDIUM = 10
const LARGE = 30
const PERCENT = 100
const SHARE = 0.846
const SHARE_PERCENT = 85
const HALF_SHARE = 0.5
const COLUMN_COUNT = 3
const REQUESTS = 3478

const formatValue = (value: number) => `${value} units`

const column = (
  overrides: Partial<TopConsumersColumn> = {}
): TopConsumersColumn => ({
  key: 'filesystems',
  title: 'Top Filesystems',
  items: [
    { name: 'small', value: SMALL },
    { name: 'large', value: LARGE },
    { name: 'medium', value: MEDIUM }
  ],
  formatValue,
  ...overrides
})

const renderWidget = (
  columns: TopConsumersColumn[] = [column()],
  props: Partial<Parameters<typeof TopConsumersWidget>[0]> = {}
) =>
  render(
    <TopConsumersWidget
      columns={columns}
      dataTestId={WIDGET_TEST_ID}
      metric={TOP_CONSUMERS_METRICS.THROUGHPUT}
      onMetricChange={vi.fn()}
      {...props}
    />
  )

describe('TopConsumersWidget', () => {
  it('renders the title and a metric toggle that reports changes', () => {
    const onMetricChange = vi.fn()
    renderWidget([column()], { onMetricChange })

    expect(
      screen.getByRole('heading', { name: 'Top Consumers' })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'IOPS' }))

    expect(onMetricChange).toHaveBeenCalledWith(TOP_CONSUMERS_METRICS.IOPS)
  })

  it('lists rows sorted descending, capped at maxItems, with formatted values', () => {
    renderWidget([column()], { maxItems: 2 })

    const rows = within(
      screen.getByTestId(`${WIDGET_TEST_ID}-filesystems`)
    ).getAllByRole('listitem')

    expect(rows.map((row) => row.textContent)).toEqual([
      `large${LARGE} units`,
      `medium${MEDIUM} units`
    ])
  })

  it('scales each bar to the largest value', () => {
    renderWidget()

    const widths = screen
      .getAllByTestId(`${WIDGET_TEST_ID}-filesystems-bar`)
      .map((bar) => bar.style.width)

    expect(widths).toEqual([
      `${PERCENT}%`,
      `${(MEDIUM / LARGE) * PERCENT}%`,
      `${(SMALL / LARGE) * PERCENT}%`
    ])
  })

  it('uses a distinct default gradient per column and honours an override', () => {
    renderWidget([
      column({ key: 'first' }),
      column({ key: 'second' }),
      column({ key: 'third', gradient: CUSTOM_GRADIENT })
    ])

    const fills = ['first', 'second', 'third'].map(
      (key) =>
        screen.getAllByTestId(`${WIDGET_TEST_ID}-${key}-bar`)[0].style
          .background
    )

    expect(new Set(fills).size).toBe(COLUMN_COUNT)
    expect(fills[2]).toContain(CUSTOM_GRADIENT.start)
    expect(fills[2]).toContain(CUSTOM_GRADIENT.end)
  })

  it('shows the share footer only when share and label are both known', () => {
    renderWidget([
      column({
        key: 'with',
        shareOfTotal: SHARE,
        shareLabel: 'tenant throughput'
      }),
      column({ key: 'without', shareOfTotal: 0.5 })
    ])

    expect(
      within(screen.getByTestId(`${WIDGET_TEST_ID}-with`)).getByText(
        `Top 3 = ${SHARE_PERCENT}% of tenant throughput`
      )
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId(`${WIDGET_TEST_ID}-without`)).queryByText(
        /Top 3/
      )
    ).not.toBeInTheDocument()
  })

  it('renders a badge and secondary values when provided', () => {
    renderWidget([
      column({
        key: 's3',
        title: 'Top S3 Buckets',
        badge: 'NEW',
        items: [
          { name: 'bucket', value: REQUESTS, secondaryValue: HALF_SHARE }
        ],
        formatSecondaryValue: (value) => `${value} GB/s`
      })
    ])

    const card = screen.getByTestId(`${WIDGET_TEST_ID}-s3`)

    expect(within(card).getByText('NEW')).toBeInTheDocument()
    expect(within(card).getByText(`${HALF_SHARE} GB/s`)).toBeInTheDocument()
  })

  it('renders a quick link only for columns that can navigate', () => {
    const onNavigate = vi.fn()
    renderWidget([
      column({ key: 'linked', onNavigate }),
      column({ key: 'plain' })
    ])

    fireEvent.click(
      screen.getByRole('button', { name: 'Open Top Filesystems' })
    )

    expect(onNavigate).toHaveBeenCalledTimes(1)
    expect(
      within(screen.getByTestId(`${WIDGET_TEST_ID}-plain`)).queryByRole(
        'button'
      )
    ).not.toBeInTheDocument()
  })

  it('renders loading, error and empty states per column without a share footer', () => {
    const share = { shareOfTotal: SHARE, shareLabel: 'tenant throughput' }
    renderWidget([
      column({ key: 'loading', isLoading: true, ...share }),
      column({ key: 'error', isError: true, ...share }),
      column({
        key: 'empty',
        items: [],
        emptyMessage: 'Not available yet',
        ...share
      })
    ])

    expect(screen.queryByText(/of tenant throughput/)).not.toBeInTheDocument()

    expect(
      within(screen.getByTestId(`${WIDGET_TEST_ID}-loading`)).queryByRole(
        'list'
      )
    ).not.toBeInTheDocument()
    expect(
      within(screen.getByTestId(`${WIDGET_TEST_ID}-error`)).queryByRole('list')
    ).not.toBeInTheDocument()
    expect(
      within(screen.getByTestId(`${WIDGET_TEST_ID}-empty`)).getByText(
        'Not available yet'
      )
    ).toBeInTheDocument()
  })
})
