import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SEVERITY_TYPES } from '../../utils/consts'

import type { DashboardCardProps } from './DashboardCard'
import { DashboardCard } from './DashboardCard'

const TEST_ID = 'test-card'
const COUNT_TEST_ID = `${TEST_ID}-count`
const ALERT_BADGE_TEST_ID = `${TEST_ID}-count-icon-with-number`
const SUBTITLE_TEXT = 'Subtitle text'

const createProps = (overrides: Partial<DashboardCardProps> = {}) => ({
  title: 'Test Card',
  children: <div>Card content</div>,
  ...overrides
})

describe('DashboardCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the title', () => {
      render(<DashboardCard {...createProps()} />)
      expect(screen.getByText('Test Card')).toBeInTheDocument()
    })

    it('renders children content', () => {
      render(<DashboardCard {...createProps()} />)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders with data-testid when provided', () => {
      render(<DashboardCard {...createProps({ dataTestId: TEST_ID })} />)
      expect(screen.getByTestId(TEST_ID)).toBeInTheDocument()
    })

    it('renders title with data-testid when card has dataTestId', () => {
      render(<DashboardCard {...createProps({ dataTestId: TEST_ID })} />)
      expect(screen.getByTestId(`${TEST_ID}-title`)).toBeInTheDocument()
    })

    it('renders subtitle when provided', () => {
      render(<DashboardCard {...createProps({ subtitle: SUBTITLE_TEXT })} />)
      expect(screen.getByText(SUBTITLE_TEXT)).toBeInTheDocument()
    })

    it('does not render subtitle when not provided', () => {
      render(<DashboardCard {...createProps()} />)
      expect(screen.queryByText(SUBTITLE_TEXT)).not.toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    it('renders info icon when tooltip is provided', () => {
      render(<DashboardCard {...createProps({ tooltip: 'Help text' })} />)
      const infoIcon = document.querySelector('[class*="infoIcon"]')
      expect(infoIcon).toBeInTheDocument()
    })

    it('does not render info icon when tooltip is not provided', () => {
      render(<DashboardCard {...createProps()} />)
      const infoIcon = document.querySelector('[class*="infoIcon"]')
      expect(infoIcon).not.toBeInTheDocument()
    })
  })

  describe('Count Badge', () => {
    it('renders count badge when count is provided without severity', () => {
      render(
        <DashboardCard {...createProps({ count: 5, dataTestId: TEST_ID })} />
      )
      expect(screen.getByTestId(COUNT_TEST_ID)).toHaveTextContent('5')
    })

    it('renders 99+ when count exceeds 99', () => {
      render(
        <DashboardCard {...createProps({ count: 100, dataTestId: TEST_ID })} />
      )
      expect(screen.getByTestId(COUNT_TEST_ID)).toHaveTextContent('99+')
    })

    it('does not render count badge when count is 0', () => {
      render(
        <DashboardCard {...createProps({ count: 0, dataTestId: TEST_ID })} />
      )
      expect(screen.queryByTestId(COUNT_TEST_ID)).not.toBeInTheDocument()
    })

    it('does not render count badge when count is not provided', () => {
      render(<DashboardCard {...createProps({ dataTestId: TEST_ID })} />)
      expect(screen.queryByTestId(COUNT_TEST_ID)).not.toBeInTheDocument()
    })
  })

  describe('Alert Badge with Severity', () => {
    it('renders AlertBadge when both count and severity are provided', () => {
      render(
        <DashboardCard
          {...createProps({
            count: 3,
            severity: SEVERITY_TYPES.CRITICAL,
            dataTestId: TEST_ID
          })}
        />
      )
      expect(screen.getByTestId(ALERT_BADGE_TEST_ID)).toBeInTheDocument()
    })

    it('displays count in AlertBadge', () => {
      render(
        <DashboardCard
          {...createProps({
            count: 5,
            severity: SEVERITY_TYPES.MAJOR,
            dataTestId: TEST_ID
          })}
        />
      )
      expect(screen.getByTestId(ALERT_BADGE_TEST_ID)).toHaveTextContent('5')
    })

    it('does not render AlertBadge when severity is provided but count is 0', () => {
      render(
        <DashboardCard
          {...createProps({
            count: 0,
            severity: SEVERITY_TYPES.WARNING,
            dataTestId: TEST_ID
          })}
        />
      )
      expect(screen.queryByTestId(ALERT_BADGE_TEST_ID)).not.toBeInTheDocument()
    })

    it('does not render regular badge when severity is provided with count', () => {
      render(
        <DashboardCard
          {...createProps({
            count: 5,
            severity: SEVERITY_TYPES.MINOR,
            dataTestId: TEST_ID
          })}
        />
      )
      expect(screen.queryByTestId(COUNT_TEST_ID)).not.toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    it('renders actions when provided', () => {
      render(
        <DashboardCard {...createProps({ actions: <button>Action</button> })} />
      )
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })
})
