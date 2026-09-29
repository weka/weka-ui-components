import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { FileUpload } from './FileUpload'

const DEFAULT_BUTTON_TEXT = 'Choose File'
const CUSTOM_BUTTON_TEXT = 'Upload Certificate'
const SAMPLE_FILE_NAME = 'my-cert.pem'
const DATA_TEST_ID = 'file-upload-input'
const SAMPLE_LABEL = 'TLS CA Certificate'
const REQUIRED_INDICATOR = '*'

const createProps = (overrides = {}) => ({
  onChange: vi.fn(),
  ...overrides
})

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('FileUpload - Rendering', () => {
  it('renders button with default buttonText', () => {
    render(<FileUpload {...createProps()} />)
    expect(screen.getByText(DEFAULT_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('renders button with custom buttonText', () => {
    render(<FileUpload {...createProps({ buttonText: CUSTOM_BUTTON_TEXT })} />)
    expect(screen.getByText(CUSTOM_BUTTON_TEXT)).toBeInTheDocument()
  })

  it('renders fileName when provided', () => {
    render(<FileUpload {...createProps({ fileName: SAMPLE_FILE_NAME })} />)
    expect(screen.getByText(SAMPLE_FILE_NAME)).toBeInTheDocument()
  })

  it('does not render fileName element when fileName is empty', () => {
    render(<FileUpload {...createProps()} />)
    expect(screen.queryByText(SAMPLE_FILE_NAME)).not.toBeInTheDocument()
  })

  it('renders hidden file input with data-testid', () => {
    render(<FileUpload {...createProps({ dataTestId: DATA_TEST_ID })} />)
    expect(screen.getByTestId(DATA_TEST_ID)).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<FileUpload {...createProps({ label: SAMPLE_LABEL })} />)
    expect(screen.getByText(SAMPLE_LABEL)).toBeInTheDocument()
  })

  it('renders required indicator when required is true', () => {
    render(
      <FileUpload {...createProps({ label: SAMPLE_LABEL, required: true })} />
    )
    expect(screen.getByText(REQUIRED_INDICATOR)).toBeInTheDocument()
  })

  it('does not render required indicator when required is false', () => {
    render(
      <FileUpload {...createProps({ label: SAMPLE_LABEL, required: false })} />
    )
    expect(screen.queryByText(REQUIRED_INDICATOR)).not.toBeInTheDocument()
  })

  it('does not render required indicator without a label', () => {
    render(<FileUpload {...createProps({ required: true })} />)
    expect(screen.queryByText(REQUIRED_INDICATOR)).not.toBeInTheDocument()
  })
})

describe('FileUpload - User Interactions', () => {
  it('calls onChange with File when a file is selected', () => {
    const onChange = vi.fn()
    render(
      <FileUpload {...createProps({ onChange, dataTestId: DATA_TEST_ID })} />
    )

    const file = new File(['content'], 'test.pem', { type: 'text/plain' })
    const input = screen.getByTestId<HTMLInputElement>(DATA_TEST_ID)

    fireEvent.change(input, { target: { files: [file] } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(file)
  })

  it('fires onChange again when the same file is re-selected', () => {
    const onChange = vi.fn()
    render(
      <FileUpload {...createProps({ onChange, dataTestId: DATA_TEST_ID })} />
    )

    const file = new File(['content'], 'test.pem', { type: 'text/plain' })
    const input = screen.getByTestId<HTMLInputElement>(DATA_TEST_ID)

    fireEvent.change(input, { target: { files: [file] } })
    expect(input.value).toBe(EMPTY_STRING)

    fireEvent.change(input, { target: { files: [file] } })

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenNthCalledWith(2, file)
  })

  it('calls onChange with null when no file is selected', () => {
    const onChange = vi.fn()
    render(
      <FileUpload {...createProps({ onChange, dataTestId: DATA_TEST_ID })} />
    )

    const input = screen.getByTestId<HTMLInputElement>(DATA_TEST_ID)

    fireEvent.change(input, { target: { files: [] } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(null)
  })
})

describe('FileUpload - Disabled state', () => {
  it('disables the hidden input when disabled is true', () => {
    render(
      <FileUpload
        {...createProps({ disabled: true, dataTestId: DATA_TEST_ID })}
      />
    )
    expect(screen.getByTestId<HTMLInputElement>(DATA_TEST_ID)).toBeDisabled()
  })

  it('marks label with data-disabled when disabled is true', () => {
    render(<FileUpload {...createProps({ disabled: true })} />)
    const button = screen.getByText(DEFAULT_BUTTON_TEXT)
    expect(button).toHaveAttribute('data-disabled', 'true')
  })

  it('enables the hidden input when disabled is false', () => {
    render(
      <FileUpload
        {...createProps({ disabled: false, dataTestId: DATA_TEST_ID })}
      />
    )
    expect(
      screen.getByTestId<HTMLInputElement>(DATA_TEST_ID)
    ).not.toBeDisabled()
  })
})

describe('FileUpload - Accessibility', () => {
  it('associates button label with hidden input via htmlFor', () => {
    render(<FileUpload {...createProps({ dataTestId: DATA_TEST_ID })} />)
    const input = screen.getByTestId<HTMLInputElement>(DATA_TEST_ID)
    const button = screen.getByText(DEFAULT_BUTTON_TEXT)
    expect(button.getAttribute('for')).toBe(input.id)
  })

  it('marks the hidden input required for assistive technology', () => {
    render(
      <FileUpload
        {...createProps({
          label: SAMPLE_LABEL,
          required: true,
          dataTestId: DATA_TEST_ID
        })}
      />
    )
    expect(screen.getByTestId(DATA_TEST_ID)).toHaveAttribute(
      'aria-required',
      'true'
    )
  })

  it('reports the hidden input as not required by default', () => {
    render(
      <FileUpload
        {...createProps({ label: SAMPLE_LABEL, dataTestId: DATA_TEST_ID })}
      />
    )
    expect(screen.getByTestId(DATA_TEST_ID)).toHaveAttribute(
      'aria-required',
      'false'
    )
  })

  it('hides the required marker from assistive technology', () => {
    render(
      <FileUpload {...createProps({ label: SAMPLE_LABEL, required: true })} />
    )
    expect(screen.getByText(REQUIRED_INDICATOR)).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })

  it('passes accept attribute to hidden input', () => {
    render(
      <FileUpload
        {...createProps({ accept: '.pem,.crt', dataTestId: DATA_TEST_ID })}
      />
    )
    expect(screen.getByTestId(DATA_TEST_ID)).toHaveAttribute(
      'accept',
      '.pem,.crt'
    )
  })
})
