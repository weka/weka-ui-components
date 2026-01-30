import { useEffect, useRef, useState } from 'react'
import type { IAceEditor } from 'react-ace/lib/types'

import { EMPTY_STRING } from 'consts'

function useSearch({
  allowSearch,
  editorReady,
  editor,
  value,
  externalSearchTerm,
  externalSearchIsRegex = false
}: {
  allowSearch: boolean
  editorReady: boolean
  editor?: IAceEditor
  value: string
  externalSearchTerm?: string
  externalSearchIsRegex?: boolean
}) {
  const [searchValue, setSearchValueState] = useState(EMPTY_STRING)

  const searchValueRef = useRef(searchValue)
  searchValueRef.current = searchValue

  useEffect(() => {
    if (!editor) {
      return
    }

    if (allowSearch) {
      editor.execCommand('find')
      const searchInput = editor.searchBox.searchInput

      if (editor.searchBox.searchInput) {
        searchInput.value = searchValueRef.current
      }

      editor.execCommand('find')
    }
  }, [allowSearch, editor, value])

  useEffect(() => {
    if (allowSearch && editorReady && editor) {
      const onSearchChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        setSearchValueState(target.value)
      }

      const searchInput = editor.searchBox.searchInput
      searchInput?.addEventListener('input', onSearchChange)

      return () => {
        searchInput?.removeEventListener('input', onSearchChange)
      }
    }
  }, [allowSearch, editor, editorReady])

  useEffect(() => {
    if (externalSearchTerm && editor && editorReady) {
      const timeoutId = setTimeout(() => {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4020e188-f290-43b5-bff8-c3a5319aa143',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSearch.ts:effect',message:'Starting external search',data:{externalSearchTerm,externalSearchIsRegex,hasEditor:!!editor,editorReady},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        editor.execCommand('find')
        const searchBox = editor.searchBox
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4020e188-f290-43b5-bff8-c3a5319aa143',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSearch.ts:afterExecCommand',message:'After execCommand find',data:{hasSearchBox:!!searchBox,hasSearchInput:!!searchBox?.searchInput,hasRegExpOption:!!searchBox?.regExpOption,hasFind:typeof searchBox?.find},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C,D'})}).catch(()=>{});
        // #endregion
        if (searchBox) {
          searchBox.searchInput.value = externalSearchTerm
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4020e188-f290-43b5-bff8-c3a5319aa143',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSearch.ts:beforeSync',message:'Before $syncOptions',data:{activeInput:searchBox.activeInput?.className,regExpOptionChecked:searchBox.regExpOption?.checked,regExpOptionTagName:searchBox.regExpOption?.tagName,hasSyncOptions:typeof searchBox.$syncOptions},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F,G'})}).catch(()=>{});
          // #endregion
          searchBox.regExpOption.checked = externalSearchIsRegex
          searchBox.$syncOptions()
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4020e188-f290-43b5-bff8-c3a5319aa143',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSearch.ts:afterSync',message:'After $syncOptions',data:{activeInputAfter:searchBox.activeInput?.className,regExpOptionCheckedAfter:searchBox.regExpOption?.checked},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F,G'})}).catch(()=>{});
          // #endregion
        }
      }, 50)
      return () => clearTimeout(timeoutId)
    } else if (!externalSearchTerm && editor) {
      const searchBox = editor.searchBox
      if (searchBox) {
        searchBox.searchInput.value = EMPTY_STRING
        searchBox.$syncOptions()
      }
    }
  }, [externalSearchTerm, externalSearchIsRegex, editor, editorReady, value])

  return searchValue
}

export default useSearch
