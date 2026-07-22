import type { Meta, StoryObj } from '@storybook/react'

import { NOP } from '#consts'

import { MaintenanceIcon, NotFoundIcon } from '../../icons'
import { Button } from '../Button'
import { ErrorPage } from './ErrorPage'

const meta: Meta<typeof ErrorPage> = {
  title: 'v2/ErrorPage',
  component: ErrorPage,
  parameters: { layout: 'fullscreen' }
}

export default meta
type Story = StoryObj<typeof ErrorPage>

export const NotFound: Story = {
  args: {
    icon: <NotFoundIcon />,
    title: '404 - Page not found',
    message: "The page you're looking for doesn't exist"
  }
}

export const Maintenance: Story = {
  args: {
    icon: <MaintenanceIcon />,
    title: 'Maintenance in progress',
    message:
      'We’re making a few updates behind the scenes, we’ll be back shortly'
  }
}

export const GenericError: Story = {
  args: {
    icon: <NotFoundIcon />,
    title: 'Something went wrong',
    message: 'An unexpected error occurred, try reloading the page'
  }
}

export const WithAction: Story = {
  args: {
    icon: <NotFoundIcon />,
    title: '404 - Page not found',
    message: "The page you're looking for doesn't exist",
    children: (
      <div>
        <Button onClick={NOP}>Back to home page</Button>
      </div>
    )
  }
}
