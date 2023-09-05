import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { useTextEditorContext } from '../../context'
import { Tag } from '../../hooks'
import clsx from 'clsx'

import './tagsInput.scss'
import SpanTooltip from '../../../SpanTooltip'
import { Close, Info } from '../../../../svgs'
import Tooltip from '../../../Tooltip'
import { ClickAwayListener } from '@mui/base'

function TagsInput() {
  const {
    value: { tags },
    setTextEditorContext
  } = useTextEditorContext('TagsInput')

  const [inputValue, setInputValue] = useState('')
  const [isFocused, setFocused] = useState(false)

  const isValueCorrect = inputValue[0] === '+' || inputValue[0] === '-'

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value)
  }

  const handleTagRemove = (tag: Tag) => {
    // Remove a tag when the user clicks on it
    const updatedTags = tags?.filter((t) => t !== tag)
    setTextEditorContext((prev) => ({ ...prev, tags: updatedTags }))
  }

  const addNewTag = () => {
    if (isValueCorrect && inputValue.length > 1) {
      setTextEditorContext((prev) => {
        const newTagType = inputValue[0] === '+' ? 'plus' : 'minus'
        const newTagValue = inputValue.slice(1)

        if (prev.tags?.find((tag) => tag.value === newTagValue)) {
          return prev
        }

        return {
          ...prev,
          tags: [
            ...(prev?.tags || []),
            { type: newTagType, value: newTagValue }
          ]
        }
      })

      setInputValue('')
    }
  }

  useEffect(() => /* unselect text*/ undefined, [tags])

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (isFocused) {
          setFocused(false)
          addNewTag()
        }
      }}
    >
      <div
        className={clsx('text-editor-tags-input-root', isFocused && 'focused')}
        onClick={() => inputRef.current?.focus()}
      >
        <div className='text-editor-tags-input-container'>
          <span className='field__label-wrap'>
            <span className='field__label field-1-label-content'>Tags</span>
            <Tooltip data='Start a new tag with + or -'>
              <Info height={12} />
            </Tooltip>
          </span>
          <div className='content'>
            {tags?.map((tag, index) => (
              <div key={index} className='tag'>
                <SpanTooltip>
                  {`${tag.type === 'plus' ? '+' : '-'}${tag.value}`}
                </SpanTooltip>
                <button
                  onClick={() => {
                    handleTagRemove(tag)
                  }}
                >
                  <Close />
                </button>
              </div>
            ))}
            <input
              ref={inputRef}
              type='text'
              placeholder={tags && tags.length > 0 ? '' : 'Add...'}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim() !== '') {
                  addNewTag()
                }

                if (
                  e.key === 'Backspace' &&
                  inputValue.length === 0 &&
                  tags &&
                  tags.length > 0
                ) {
                  setTextEditorContext((prev) => {
                    return {
                      ...prev,
                      tags: (prev.tags || []).slice(
                        0,
                        prev.tags && prev.tags?.length - 1
                      )
                    }
                  })
                }
              }}
              onFocus={() => {
                setFocused(true)
              }}
              className={clsx(!isValueCorrect && 'incorrect-input')}
            />
          </div>
          {tags && tags.length > 0 && (
            <button
              className='remove-all-btn'
              onClick={() => {
                setTextEditorContext((prev) => {
                  return {
                    ...prev,
                    tags: []
                  }
                })
              }}
            >
              <Close />
            </button>
          )}
        </div>
      </div>
    </ClickAwayListener>
  )
}

export default TagsInput
