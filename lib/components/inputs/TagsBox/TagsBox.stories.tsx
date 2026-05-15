import type { TagsBoxProps } from './TagsBox'
import type { Meta, StoryObj } from '@storybook/react'

import React, { useState } from 'react'

import { default as TagsBoxComponent } from './TagsBox'

const meta: Meta<typeof TagsBoxComponent> = {
  component: TagsBoxComponent,
  title: 'Components/inputs/TagsBox'
}
export default meta

type Story = StoryObj<typeof TagsBoxComponent>

function TagsBoxComponentWithState(args: TagsBoxProps) {
  const [value, setValue] = useState<string[]>([])
  const handleOnChange = (newValue: string[]) => {
    setValue(newValue)
  }
  return (
    <TagsBoxComponent
      {...args}
      label='Tagsbox Label'
      onChange={handleOnChange}
      value={value}
    />
  )
}

export const Default: Story = {
  args: {},
  render: (args: TagsBoxProps) => <TagsBoxComponentWithState {...args} />
}
