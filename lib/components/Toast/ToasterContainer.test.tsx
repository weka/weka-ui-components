import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import Utils from '#utils'

import ToasterContainer from './ToasterContainer'

const SUCCESS_MESSAGE = 'Saved successfully'
const ERROR_MESSAGE = 'Failed to save'
const DUPLICATE_ID = 'duplicate-toast'
const TOAST_SELECTOR = '.Toastify__toast'
const CLOSE_ON_CLICK_CLASS = 'Toastify__toast--close-on-click'

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

  it('makes toasts dismissible by clicking them', async () => {
    render(<ToasterContainer />)
    act(() => {
      Utils.toastSuccess(SUCCESS_MESSAGE)
    })

    const message = await screen.findByText(SUCCESS_MESSAGE)

    expect(message.closest(TOAST_SELECTOR)).toHaveClass(CLOSE_ON_CLICK_CLASS)
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
