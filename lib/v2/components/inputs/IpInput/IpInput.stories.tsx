import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { EMPTY_STRING, NOOP } from '#v2/utils/consts'

import { IpInput } from './IpInput'

import storiesStyles from './ipInputStories.module.scss'

const meta: Meta<typeof IpInput> = {
  title: 'v2/Inputs/IpInput',
  component: IpInput,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof IpInput>

// eslint-disable-next-line sonarjs/no-hardcoded-ip
const EXAMPLE_IP = '192.168.1.1'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const DISABLED_EXAMPLE_IP = '10.0.0.1'

function ControlledIpInput({
  initialValue = EMPTY_STRING
}: Readonly<{ initialValue?: string }>) {
  const [value, setValue] = useState(initialValue)
  return (
    <div className={storiesStyles.container}>
      <IpInput
        label='IP Address'
        onChange={setValue}
        required
        value={value}
      />
      <p className={storiesStyles.valueDisplay}>
        Value: {JSON.stringify(value)}
      </p>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <ControlledIpInput initialValue={EXAMPLE_IP} />
}

export const WithError: Story = {
  render: () => (
    <div className={storiesStyles.container}>
      <IpInput
        error='Invalid IP address'
        label='IP Address'
        onChange={NOOP}
        required
        value={EMPTY_STRING}
      />
    </div>
  )
}

export const Disabled: Story = {
  render: () => (
    <div className={storiesStyles.container}>
      <IpInput
        disabled
        label='IP Address'
        onChange={NOOP}
        value={DISABLED_EXAMPLE_IP}
      />
    </div>
  )
}
