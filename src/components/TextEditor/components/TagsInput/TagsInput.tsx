import React from 'react'
import { useTextEditorContext } from '../../context'
import { TagsBox } from '../../../inputs'
import clsx from 'clsx'

import './tagsInput.scss'

interface TagsInputProps {
  wrapperClass?: string
}

function TagsInput(props: TagsInputProps) {
  const { wrapperClass } = props

  const {
    value: { tags },
    setTextEditorContext
  } = useTextEditorContext('TagsInput')

  return (
    <TagsBox
      value={tags}
      // TODO: review text
      info={'Start a new tag with "+" or "-"'}
      placeholder='Add a tag'
      onChange={(newTags) =>
        setTextEditorContext((prev) => ({ ...prev, tags: newTags }))
      }
      label='Tags'
      tagsValidation={(tags) =>
        tags.filter(
          (tag) =>
            tag.length >= 2 && (tag.startsWith('+') || tag.startsWith('-'))
        )
      }
      invalidTagText={
        // TODO: review text
        'A new tag must start with "+" or "-" and be 2 or more characters long'
      }
      wrapperClass={clsx('text-editor-tags-input', wrapperClass)}
    />
  )
}

export default TagsInput
