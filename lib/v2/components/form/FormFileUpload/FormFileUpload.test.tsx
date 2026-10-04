import { useForm } from 'react-hook-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { FormPopup } from '../FormPopup'
import { FormFileUpload } from './FormFileUpload'

interface HostValues {
  fileContent: string
}

const UPLOAD_LABEL = 'Upload certificate'

function Host() {
  const form = useForm<HostValues>({
    defaultValues: { fileContent: EMPTY_STRING }
  })

  return (
    <FormPopup
      form={form}
      onClose={() => undefined}
      onSubmit={() => undefined}
      open
      title='Host'
    >
      <FormFileUpload<HostValues>
        label={UPLOAD_LABEL}
        name='fileContent'
        required
      />
    </FormPopup>
  )
}

describe('FormFileUpload', () => {
  it('renders a labelled file input', async () => {
    render(<Host />)

    expect(await screen.findByLabelText(UPLOAD_LABEL)).toBeInTheDocument()
  })

  it('marks the input required with an asterisk and aria-required', async () => {
    render(<Host />)

    const input = await screen.findByLabelText(UPLOAD_LABEL)
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(screen.getByText(UPLOAD_LABEL).parentElement).toHaveTextContent('*')
  })

  it('shows the selected filename after a file is chosen', async () => {
    render(<Host />)

    const input = await screen.findByLabelText(UPLOAD_LABEL)
    const file = new File(['PEM-DATA'], 'cert.pem', { type: 'text/plain' })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('cert.pem')).toBeInTheDocument()
    })
  })
})
