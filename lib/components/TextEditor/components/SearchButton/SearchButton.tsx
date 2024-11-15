import React from 'react'

import { useTextEditorContext } from '../../context'
import Tooltip from '../../../Tooltip'
import { IconButton } from '@mui/material'
import { Search } from 'svgs'

import './searchButton.scss'

function SearchButton() {
  const {
    value: { isLiteMode, allowSearch = false },
    setTextEditorContext
  } = useTextEditorContext('ExpandCollapseBtn')

  let disabled: string | false = false

  if (isLiteMode) {
    // TODO: review text
    disabled = 'Search is not supported for large files'
  }

  return (
    <Tooltip data={disabled || 'Search'}>
      <div className='text-editor-search-button'>
        <IconButton
          disabled={!!disabled}
          onClick={() =>
            setTextEditorContext((prev) => ({
              ...prev,
              allowSearch: !allowSearch
            }))
          }
        >
          <Search />
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default SearchButton
