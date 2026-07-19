import type { AlertBannerItemData } from './types'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SEVERITY_TYPES } from '#v2/utils/consts'

import { AlertBannerItem } from './AlertBannerItem'

const CLOSE_TESTID = 'alert-banner-close'
const BANNER_TESTID = 'alert-banner-item'
const LINK_TEXT = 'More info'
const EXAMPLE_URL = 'https://example.com'

const baseBanner: AlertBannerItemData = {
  id: 'test-1',
  severity: SEVERITY_TYPES.CRITICAL,
  boldPrefix: 'Support -',
  message: 'your cluster Production license has expired.',
  closable: true
}

describe('AlertBannerItem', () => {
  it('renders message and bold prefix', () => {
    render(<AlertBannerItem item={baseBanner} />)

    expect(screen.getByText('Support -')).toBeInTheDocument()
    expect(
      screen.getByText('your cluster Production license has expired.')
    ).toBeInTheDocument()
  })

  it('renders close button when closable', () => {
    render(<AlertBannerItem item={baseBanner} />)

    expect(screen.getByTestId(CLOSE_TESTID)).toBeInTheDocument()
  })

  it('does not render close button when not closable', () => {
    render(<AlertBannerItem item={{ ...baseBanner, closable: false }} />)

    expect(screen.queryByTestId(CLOSE_TESTID)).toBeNull()
  })

  it('calls onDismiss with banner id when close is clicked', () => {
    const onDismiss = vi.fn()
    render(
      <AlertBannerItem
        item={baseBanner}
        onDismiss={onDismiss}
      />
    )

    fireEvent.click(screen.getByTestId(CLOSE_TESTID))
    expect(onDismiss).toHaveBeenCalledWith('test-1')
  })

  it('renders external link when linkUrl is provided', () => {
    render(
      <AlertBannerItem
        item={{
          ...baseBanner,
          linkText: LINK_TEXT,
          linkUrl: EXAMPLE_URL
        }}
      />
    )

    const link = screen.getByText(LINK_TEXT)
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', EXAMPLE_URL)
  })

  it('renders button link when onLinkClick is provided', () => {
    const onClick = vi.fn()
    render(
      <AlertBannerItem
        item={{
          ...baseBanner,
          linkText: LINK_TEXT,
          onLinkClick: onClick
        }}
      />
    )

    const link = screen.getByText(LINK_TEXT)
    expect(link.tagName).toBe('BUTTON')
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('prefers onLinkClick over linkUrl', () => {
    const onClick = vi.fn()
    render(
      <AlertBannerItem
        item={{
          ...baseBanner,
          linkText: LINK_TEXT,
          linkUrl: EXAMPLE_URL,
          onLinkClick: onClick
        }}
      />
    )

    expect(screen.getByText(LINK_TEXT).tagName).toBe('BUTTON')
  })

  it('renders without link when neither linkUrl nor onLinkClick', () => {
    render(<AlertBannerItem item={{ ...baseBanner, linkText: LINK_TEXT }} />)

    expect(screen.queryByText(LINK_TEXT)).toBeNull()
  })

  it('has role=alert and aria-live=polite', () => {
    render(<AlertBannerItem item={baseBanner} />)

    const banner = screen.getByTestId(BANNER_TESTID)
    expect(banner).toHaveAttribute('role', 'alert')
    expect(banner).toHaveAttribute('aria-live', 'polite')
  })

  it('applies the severity class on the banner root', () => {
    render(<AlertBannerItem item={baseBanner} />)

    expect(screen.getByTestId(BANNER_TESTID).className).toMatch(/critical/)
  })
})
