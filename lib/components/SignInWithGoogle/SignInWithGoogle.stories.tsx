import React from 'react'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryFn } from '@storybook/react'

import SignInWithGoogle from './SignInWithGoogle'

export default {
  title: 'Components/SignInWithGoogle',
  component: SignInWithGoogle
} as Meta

const Template: StoryFn = () => (
  <SignInWithGoogle
    apiCall={action('apiCall')}
    clientId='dummy-client-id'
    googleApi='https://accounts.google.com/gsi/client'
    scope='https://www.googleapis.com/auth/userinfo.profile'
  />
)

export const Default = Template.bind({})
Default.args = {}
