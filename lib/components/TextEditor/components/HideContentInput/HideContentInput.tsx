import React, { useEffect } from 'react'
import { useLocalStorage } from 'react-use'
import clsx from 'clsx'

import { TagsBox } from '../../../inputs'
import { useTextEditorContext } from '../../context'

import './hideContentInput.scss'

interface HideContentInputProps {
  wrapperClass?: string
}

const DISABLE_SYNTAX_CHECK_KEY = 'hideContent'
const HIDE_CONTENT_STORAGE_KEY = 'text-editor-hide-content'

function HideContentInput({ wrapperClass }: HideContentInputProps) {
  const [invalidText, setInvalidText] = React.useState(
    'Incorrect regular expression'
  )

  const {
    setTextEditorContext,
    value: { pageStorageKey }
  } = useTextEditorContext('HideContentInput')

  if (!pageStorageKey) {
    throw new Error(
      'pageStorageKey is required to use HideContentInput! Pass it to TextEditorProvider.'
    )
  }

  const [hideContent, setHideContent] = useLocalStorage<string[]>(
    `${HIDE_CONTENT_STORAGE_KEY}-${pageStorageKey}`
  )

  useEffect(() => {
    setTextEditorContext((prev) => {
      const newDisableSyntaxCheck = new Set(prev.shouldDisableSyntaxCheck)
      if (hideContent && hideContent.length > 0) {
        newDisableSyntaxCheck.add(DISABLE_SYNTAX_CHECK_KEY)
      } else {
        newDisableSyntaxCheck.delete(DISABLE_SYNTAX_CHECK_KEY)
      }

      return {
        ...prev,
        hideContent,
        shouldDisableSyntaxCheck: newDisableSyntaxCheck
      }
    })
  }, [hideContent, setTextEditorContext])

  return (
    <TagsBox
      info='Enter regular expression to hide specific text'
      invalidTagText={invalidText} // TODO:
      label='Hide Content'
      onChange={setHideContent}
      placeholder='Add a RegExp'
      value={hideContent}
      wrapperClass={clsx('text-editor-hide-content-input', wrapperClass)}
      tagsValidation={(regExpsArr) =>
        regExpsArr.filter((regExp) => {
          try {
            new RegExp(regExp)
            return true
          } catch (e) {
            if (e instanceof SyntaxError) {
              setInvalidText(e.message)
              return false
            }

            throw e
          }
        })
      }
    />
  )
}

export default HideContentInput
