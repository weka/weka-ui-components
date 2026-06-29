import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderTableBody } from './renderTableBody'

const BODY = <span data-testid='body-content'>content</span>
const BODY_AREA = '.tableBodyArea'

function renderBody(
  args: Partial<Parameters<typeof renderTableBody>[0]> = {}
) {
  return render(
    <div>
      {renderTableBody({
        drawer: null,
        drawerOpen: false,
        drawerWidth: 0,
        framed: false,
        tableContainerContent: BODY,
        footer: null,
        ...args
      })}
    </div>
  )
}

describe('renderTableBody', () => {
  it('renders a plain body (no frame) when there is no drawer and framed is false', () => {
    const { container, getByTestId } = renderBody()
    expect(getByTestId('body-content')).toBeInTheDocument()
    expect(container.querySelector(BODY_AREA)).toBeNull()
  })

  it('frames the body when framed is set, without a drawer', () => {
    const { container } = renderBody({ framed: true })
    expect(container.querySelector(BODY_AREA)).not.toBeNull()
  })

  it('frames the body and renders the drawer when a drawer is provided', () => {
    const { container, getByTestId } = renderBody({
      drawer: <aside data-testid='drawer'>d</aside>
    })
    expect(container.querySelector(BODY_AREA)).not.toBeNull()
    expect(getByTestId('drawer')).toBeInTheDocument()
  })
})
