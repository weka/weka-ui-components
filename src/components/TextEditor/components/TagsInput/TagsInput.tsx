import React from 'react'
import { useTextEditorContext } from '../../context'
import { TagsBox } from '../../../inputs'

import './tagsInput.scss'

function TagsInput() {
  const {
    value: { tags },
    setTextEditorContext
  } = useTextEditorContext('TagsInput')

  return (
    <TagsBox
      value={tags}
      info="Start a new tag with '+' or '-'"
      placeholder='Add...'
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
      invalidTagText='A new tag must start with + or - and be 2 or more characters long'
      wrapperClass='text-editor-tags-input'
    />
  )
}

export default TagsInput
