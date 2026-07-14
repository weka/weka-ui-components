import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FileUpload } from './FileUpload'

const DEFAULT_BUTTON_TEXT = 'Choose File'
const CUSTOM_BUTTON_TEXT = 'Upload Certificate'
const SAMPLE_FILE_NAME = 'my-cert.pem'
const DATA_TEST_ID = 'file-upload-input'

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
