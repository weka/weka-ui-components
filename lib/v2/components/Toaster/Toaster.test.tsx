import { act, render, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it } from 'vitest'

import { Toaster } from './Toaster'

const getToasterElement = () => document.querySelector('[data-sonner-toaster]')

const showToast = (message: string) => {
  act(() => {
    toast(message)
  })
}

afterEach(() => {
  act(() => {
    toast.dismiss()
  })
})

describe('Toaster', () => {
  it('renders the sonner toaster region once a toast is shown', async () => {
    render(<Toaster />)
    showToast('Region renders')
    await waitFor(() => expect(getToasterElement()).toBeInTheDocument())
  })
})
