import React from 'react'

import {
  default as SearchFieldComponent,
  SearchFieldProps
} from './SearchField'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'

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
} as ComponentMeta<typeof SearchFieldComponent>

const Template: ComponentStory<typeof SearchFieldComponent> = (
  args: SearchFieldProps
) => {
  return <SearchFieldComponent {...args} />
}

export const SearchField = Template.bind({})
SearchField.args = {
  label: 'Search Value',
  onValueUpdate: action('Value Updated'),
  shouldUpdateTerm: true,
  debounceDelay: 200
}
