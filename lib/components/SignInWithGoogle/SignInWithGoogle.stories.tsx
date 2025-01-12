import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import SignInWithGoogle from './SignInWithGoogle'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Components/SignInWithGoogle',
  component: SignInWithGoogle
} as Meta

const Template: StoryFn = () => {
  return (
    <SignInWithGoogle
      clientId='dummy-client-id'
      googleApi='https://accounts.google.com/gsi/client'
      scope='https://www.googleapis.com/auth/userinfo.profile'
      apiCall={action('apiCall')}
    />
  )
}

export const Default = Template.bind({})
Default.args = {}
