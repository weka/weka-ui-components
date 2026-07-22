import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { EMPTY_STRING, NOOP } from '#v2/utils/consts'

import { IpSubnetInput } from './IpSubnetInput'

import storiesStyles from './ipSubnetInputStories.module.scss'

const meta: Meta<typeof IpSubnetInput> = {
  title: 'v2/Inputs/IpSubnetInput',
  component: IpSubnetInput,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof IpSubnetInput>

// Example CIDRs — safe to hardcode in stories (sonarjs/no-hardcoded-ip)
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const EXAMPLE_SUBNET = '192.168.1.0/24'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const DISABLED_SUBNET = '10.0.0.0/16'

function ControlledIpSubnetInput({
  initialValue = EMPTY_STRING
}: Readonly<{ initialValue?: string }>) {
  const [value, setValue] = useState(initialValue)
  return (
    <div className={storiesStyles.container}>
      <IpSubnetInput
        label='IP/BitMask'
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
  render: () => <ControlledIpSubnetInput initialValue={EXAMPLE_SUBNET} />
}

export const WithError: Story = {
  render: () => (
    <div className={storiesStyles.container}>
      <IpSubnetInput
        error='IP/BitMask is required'
        label='IP/BitMask'
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
      <IpSubnetInput
        disabled
        label='IP/BitMask'
        onChange={NOOP}
        value={DISABLED_SUBNET}
      />
    </div>
  )
}
