import React, { useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { TagsBox } from '../../../inputs'
import { useTextEditorContext } from '../../context'

import './tagsInput.scss'

interface TagsInputProps {
  wrapperClass?: string
  addToUrl?: boolean
}

const DISABLE_SYNTAX_CHECK_KEY = 'tags'

function TagsInput({ wrapperClass, addToUrl }: TagsInputProps) {
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
      info='Start a new tag with "+" or "-"'
      invalidTagText='A new tag must start with "+" or "-" and be 2 or more characters long'
      label='Tags'
      placeholder='Add a tag'
      value={tags}
      wrapperClass={clsx('text-editor-tags-input', wrapperClass)}
      onChange={(newTags) =>
        setTextEditorContext((prev) => ({ ...prev, tags: newTags }))
      }
      tagsValidation={(tags) =>
        tags.filter(
          (tag) =>
            tag.length >= 2 && (tag.startsWith('+') || tag.startsWith('-'))
        )
      }
    />
  )
}

export default TagsInput
