import React, { useEffect } from 'react'
import { useTextEditorContext } from '../../context'
import { TagsBox } from '../../../inputs'
import clsx from 'clsx'

import './hideContentInput.scss'
import { useLocalStorage } from 'react-use'

interface HideContentInputProps {
  wrapperClass?: string
}

const DISABLE_SYNTAX_CHECK_KEY = 'hideContent'
const HIDE_CONTENT_STORAGE_KEY = 'text-editor-hide-content'

function HideContentInput(props: HideContentInputProps) {
  const { wrapperClass } = props

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

  const [hideContent = [], setHideContent] = useLocalStorage<string[]>(
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
      value={hideContent}
      info='Enter regular expression to hide specific text' // TODO:
      placeholder='Add a RegExp' // TODO:
      onChange={setHideContent}
      label='Hide Content' // TODO:
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
      invalidTagText={invalidText} // TODO:
      wrapperClass={clsx('text-editor-hide-content-input', wrapperClass)}
    />
  )
}

export default HideContentInput
