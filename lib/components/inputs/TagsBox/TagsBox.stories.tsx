import type { Meta, StoryObj } from '@storybook/react'
import { default as TagsBoxComponent, TagsBoxProps } from './TagsBox'
import React, { useState } from 'react'

const meta: Meta<typeof TagsBoxComponent> = {
  component: TagsBoxComponent,
  title: 'Components/inputs/TagsBox'
}
export default meta

type Story = StoryObj<typeof TagsBoxComponent>

const TagsBoxComponentWithState = (args: TagsBoxProps) => {
  const [value, setValue] = useState<string[]>([])
  const handleOnChange = (newValue: string[]) => {
    setValue(newValue)
  }
  return (
    <TagsBoxComponent
      {...args}
      value={value}
      onChange={handleOnChange}
      label='Tagsbox Label'
    />
  )
}

export const Default: Story = {
  args: {},
  render: (args: TagsBoxProps) => <TagsBoxComponentWithState {...args} />
}
