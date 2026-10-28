import type { SearchFieldProps } from './SearchField'
import type { Meta, StoryFn } from '@storybook/react'

import React from 'react'
import { action } from 'storybook/actions'

import { default as SearchFieldComponent } from './SearchField'

export default {
  component: SearchFieldComponent,
  title: 'Components/inputs/SearchField',
  argTypes: {
    label: {
      description: 'Label of the field',
      type: { name: 'string', required: true }
    },
    onValueUpdate: {
      description: 'The function called on update',
      type: { name: 'function', required: true }
    },
    shouldUpdateTerm: {
      description:
        'Defines the condition on which the update should be enabled',
      type: { name: 'boolean', required: false }
    },
    debounceDelay: {
      description:
        'The delay after which the update function will be called (default: 700ms)',
      type: { name: 'number', required: false }
    }
  }
} as Meta<typeof SearchFieldComponent>

function Template(args: SearchFieldProps) {
  return <SearchFieldComponent {...args} />
}

export const SearchField: StoryFn<typeof SearchFieldComponent> = Template.bind(
  {}
)
SearchField.args = {
  label: 'Search Value',
  onValueUpdate: action('Value Updated'),
  shouldUpdateTerm: true,
  debounceDelay: 200
}
