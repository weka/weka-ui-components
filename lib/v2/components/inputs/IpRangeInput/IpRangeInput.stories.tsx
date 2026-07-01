import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { EMPTY_STRING, NOOP } from '#v2/utils/consts'

import { IpRangeInput } from './IpRangeInput'

import storiesStyles from './ipRangeInputStories.module.scss'

const meta: Meta<typeof IpRangeInput> = {
  title: 'v2/Inputs/IpRangeInput',
  component: IpRangeInput,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof IpRangeInput>

const EXAMPLE_RANGE = '192.168.1.1-192.168.1.100'
const DISABLED_RANGE = '10.0.0.1-10.0.0.50'

function ControlledIpRangeInput({
  initialValue = EMPTY_STRING
}: Readonly<{ initialValue?: string }>) {
  const [value, setValue] = useState(initialValue)
  return (
    <div className={storiesStyles.container}>
      <IpRangeInput
        label='IP Range'
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
  render: () => <ControlledIpRangeInput initialValue={EXAMPLE_RANGE} />
}

export const WithError: Story = {
  render: () => (
    <div className={storiesStyles.container}>
      <IpRangeInput
        error='IP range is required'
        label='IP Range'
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
      <IpRangeInput
        disabled
        label='IP Range'
        onChange={NOOP}
        value={DISABLED_RANGE}
      />
    </div>
  )
}
