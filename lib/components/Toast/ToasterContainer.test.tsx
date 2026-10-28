import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import Utils from '#utils'

import ToasterContainer from './ToasterContainer'

const SUCCESS_MESSAGE = 'Saved successfully'
const ERROR_MESSAGE = 'Failed to save'
const DUPLICATE_ID = 'duplicate-toast'
const TOAST_SELECTOR = '.Toastify__toast'

afterEach(() => {
  act(() => {
    Utils.toastDismissAll()
  })
})

describe('ToasterContainer', () => {
  it('shows a success toast', async () => {
    render(<ToasterContainer />)

    act(() => {
      Utils.toastSuccess(SUCCESS_MESSAGE)
    })

    expect(await screen.findByText(SUCCESS_MESSAGE)).toBeInTheDocument()
  })

  it('shows an error toast', async () => {
    render(<ToasterContainer />)

    act(() => {
      Utils.toastError(ERROR_MESSAGE)
    })

    expect(await screen.findByText(ERROR_MESSAGE)).toBeInTheDocument()
  })

  it('dismisses a toast when it is clicked', async () => {
    render(<ToasterContainer />)
    act(() => {
      Utils.toastSuccess(SUCCESS_MESSAGE)
    })
    const message = await screen.findByText(SUCCESS_MESSAGE)
    const toastElement = message.closest(TOAST_SELECTOR)

    fireEvent.click(message)
    // happy-dom doesn't run CSS animations, so end the exit animation manually
    fireEvent.animationEnd(toastElement!)

    await waitFor(() => {
      expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument()
    })
  })

  it('shows a toast with a given id only once', async () => {
    render(<ToasterContainer />)

    act(() => {
      Utils.toastSuccess(SUCCESS_MESSAGE, undefined, DUPLICATE_ID)
      Utils.toastSuccess(SUCCESS_MESSAGE, undefined, DUPLICATE_ID)
    })

    expect(await screen.findAllByText(SUCCESS_MESSAGE)).toHaveLength(1)
  })
})
