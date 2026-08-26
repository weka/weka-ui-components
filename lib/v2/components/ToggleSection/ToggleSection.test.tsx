import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ToggleSection } from './ToggleSection'

const TEST_ID = 'qos-section'
const LABEL = 'QoS Settings'
const CONTENT_TEXT = 'Max IOPS'

describe('ToggleSection', () => {
  it('renders the label', () => {
    render(
      <ToggleSection
        checked={false}
        label={LABEL}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByText(LABEL)).toBeInTheDocument()
  })

  it('calls onChange with the new checked state when toggled', () => {
    const onChange = vi.fn()
    render(
      <ToggleSection
        checked={false}
        dataTestId={TEST_ID}
        label={LABEL}
        onChange={onChange}
      />
    )

    const switchInput = screen
      .getByTestId(`${TEST_ID}-switch`)
      .querySelector('input')
    fireEvent.click(switchInput as HTMLInputElement)

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('hides children while unchecked and shows them when checked', () => {
    const { rerender } = render(
      <ToggleSection
        checked={false}
        dataTestId={TEST_ID}
        label={LABEL}
        onChange={vi.fn()}
      >
        <span>{CONTENT_TEXT}</span>
      </ToggleSection>
    )

    expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument()

    rerender(
      <ToggleSection
        checked
        dataTestId={TEST_ID}
        label={LABEL}
        onChange={vi.fn()}
      >
        <span>{CONTENT_TEXT}</span>
      </ToggleSection>
    )

    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument()
  })

  it('reserves no expandable area when there is no content', () => {
    render(
      <ToggleSection
        checked
        dataTestId={TEST_ID}
        label={LABEL}
        onChange={vi.fn()}
      />
    )

    expect(screen.queryByTestId(`${TEST_ID}-content`)).not.toBeInTheDocument()
  })

  it('reserves no expandable area when the content renders nothing', () => {
    render(
      <ToggleSection
        checked
        dataTestId={TEST_ID}
        label={LABEL}
        onChange={vi.fn()}
      >
        {null}
      </ToggleSection>
    )

    expect(screen.queryByTestId(`${TEST_ID}-content`)).not.toBeInTheDocument()
  })

  it('disables the switch when disabled', () => {
    render(
      <ToggleSection
        checked={false}
        dataTestId={TEST_ID}
        disabled
        label={LABEL}
        onChange={vi.fn()}
      />
    )

    const switchInput = screen
      .getByTestId(`${TEST_ID}-switch`)
      .querySelector('input')
    expect(switchInput).toBeDisabled()
  })

  it('renders a divider by default and omits it when showDivider is false', () => {
    const { rerender } = render(
      <ToggleSection
        checked={false}
        dataTestId={TEST_ID}
        label={LABEL}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByTestId(TEST_ID).className).toMatch(/divider/)

    rerender(
      <ToggleSection
        checked={false}
        dataTestId={TEST_ID}
        label={LABEL}
        onChange={vi.fn()}
        showDivider={false}
      />
    )

    expect(screen.getByTestId(TEST_ID).className).not.toMatch(/divider/)
  })
})
