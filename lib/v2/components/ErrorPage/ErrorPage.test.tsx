import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorPage } from './ErrorPage'

const ICON_TEST_ID = 'page-icon'

function renderErrorPage(props?: Partial<Parameters<typeof ErrorPage>[0]>) {
  return render(
    <ErrorPage
      icon={<svg data-testid={ICON_TEST_ID} />}
      message='Zero latency. Also zero page.'
      title='404 - Page Not Found'
      {...props}
    />
  )
}

describe('ErrorPage', () => {
  it('renders the title in a heading', () => {
    renderErrorPage()

    const title = screen.getByText('404 - Page Not Found')
    expect(title.tagName).toBe('H1')
  })

  it('renders the message in a paragraph', () => {
    renderErrorPage()

    const message = screen.getByText('Zero latency. Also zero page.')
    expect(message.tagName).toBe('P')
  })

  it('renders the provided icon', () => {
    renderErrorPage()

    expect(screen.getByTestId(ICON_TEST_ID)).toBeInTheDocument()
  })

  it('renders children inside the content area', () => {
    renderErrorPage({
      children: <button type='button'>Back to dashboard</button>
    })

    expect(
      screen.getByRole('button', { name: 'Back to dashboard' })
    ).toBeInTheDocument()
  })

  it('uses the default test id', () => {
    renderErrorPage()

    expect(screen.getByTestId('error-page')).toBeInTheDocument()
  })

  it('applies a custom test id', () => {
    renderErrorPage({ dataTestId: 'maintenance' })

    expect(screen.getByTestId('maintenance')).toBeInTheDocument()
  })

  it('merges an extra class onto the wrapper', () => {
    renderErrorPage({ extraClass: 'customWrapper' })

    expect(screen.getByTestId('error-page')).toHaveClass('customWrapper')
  })
})
