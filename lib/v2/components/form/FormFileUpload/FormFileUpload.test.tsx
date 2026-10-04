import { useForm } from 'react-hook-form'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
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

  describe('with a controlled FileReader', () => {
    const createdReaders: FakeReader[] = []

    class FakeReader {
      result: string | null = null
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      aborted = false
      constructor() {
        createdReaders.push(this)
      }
      readAsText() {}
      abort() {
        this.aborted = true
      }
      resolve(content: string) {
        if (this.aborted) {
          return
        }
        this.result = content
        this.onload?.()
      }
      fail() {
        this.onerror?.()
      }
    }

    beforeEach(() => {
      createdReaders.length = 0
      vi.stubGlobal('FileReader', FakeReader)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    function renderUpload() {
      return renderWithForm<HostValues>(
        <FormFileUpload<HostValues>
          label={UPLOAD_LABEL}
          name='fileContent'
        />,
        { defaultValues: { fileContent: EMPTY_STRING } }
      )
    }

    function chooseFile(input: HTMLElement, name: string) {
      const file = new File(['x'], name, { type: 'text/plain' })
      fireEvent.change(input, { target: { files: [file] } })
    }

    it('keeps the latest selection when an earlier read resolves late', async () => {
      const { form } = renderUpload()
      const input = await screen.findByLabelText(UPLOAD_LABEL)

      chooseFile(input, 'a.pem')
      chooseFile(input, 'b.pem')
      const [readerA, readerB] = createdReaders
      act(() => {
        readerB.resolve('B-CONTENT')
        readerA.resolve('A-CONTENT')
      })

      expect(form.getValues('fileContent')).toBe('B-CONTENT')
      expect(screen.getByText('b.pem')).toBeInTheDocument()
      expect(screen.queryByText('a.pem')).not.toBeInTheDocument()
      expect(readerA.aborted).toBe(true)
    })

    it('clears the filename and value when the read fails', async () => {
      const { form } = renderUpload()
      const input = await screen.findByLabelText(UPLOAD_LABEL)

      chooseFile(input, 'a.pem')
      act(() => {
        createdReaders[0].resolve('A-CONTENT')
      })
      chooseFile(input, 'b.pem')
      act(() => {
        createdReaders[1].fail()
      })

      expect(form.getValues('fileContent')).toBe(EMPTY_STRING)
      expect(screen.queryByText('b.pem')).not.toBeInTheDocument()
    })
  })
})
