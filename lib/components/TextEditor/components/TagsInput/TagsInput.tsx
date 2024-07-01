import React, { useEffect, useLayoutEffect } from 'react'
import { useTextEditorContext } from '../../context'
import { TagsBox } from '../../../inputs'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

import './tagsInput.scss'

interface TagsInputProps {
  wrapperClass?: string
  addToUrl?: boolean
}

const DISABLE_SYNTAX_CHECK_KEY = 'tags'

function TagsInput(props: TagsInputProps) {
  const { wrapperClass, addToUrl } = props

  const {
    value: { tags },
    setTextEditorContext
  } = useTextEditorContext('TagsInput')

  const navigate = useNavigate()

  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const initialTags = searchParams.getAll('tags')
    if (initialTags.length > 0) {
      setTextEditorContext((prev) => ({ ...prev, tags: initialTags }))
    }
  }, [setTextEditorContext])

  useEffect(() => {
    if (addToUrl) {
      const newSearchParams = new URLSearchParams(window.location.search)
      newSearchParams.delete('tags')

      tags?.forEach((tag) => {
        newSearchParams.append('tags', tag)
      })

      navigate(`?${newSearchParams.toString()}`, { replace: true })
    }
  }, [tags, addToUrl, navigate])

  useEffect(() => {
    setTextEditorContext((prev) => {
      const newDisableSyntaxCheck = new Set(prev.shouldDisableSyntaxCheck)
      if (tags && tags.length > 0) {
        newDisableSyntaxCheck.add(DISABLE_SYNTAX_CHECK_KEY)
      } else {
        newDisableSyntaxCheck.delete(DISABLE_SYNTAX_CHECK_KEY)
      }

      return { ...prev, shouldDisableSyntaxCheck: newDisableSyntaxCheck }
    })
  }, [setTextEditorContext, tags])

  return (
    <TagsBox
      value={tags}
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
        'A new tag must start with "+" or "-" and be 2 or more characters long'
      }
      wrapperClass={clsx('text-editor-tags-input', wrapperClass)}
    />
  )
}

export default TagsInput
