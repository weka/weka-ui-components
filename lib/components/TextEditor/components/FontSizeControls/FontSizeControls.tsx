import React, { useEffect } from 'react'
import { useTextEditorContext } from '../../context'
import { useLocalStorage } from 'react-use'
import svgs from 'svgs'
import { IconButton } from '@mui/material'
import Tooltip from '../../../Tooltip/Tooltip'
import { DEFAULT_FONT_SIZE } from '../../TextEditor'

import './fontSizeControls.scss'

const { FontSizeEnlarge, FontSizeReduce } = svgs

const MIN_FONT_SIZE = 10
const MAX_FONT_SIZE = 30
const FONT_SIZE_STEP = 2

export const FONT_SIZE_STORAGE_KEY = 'text-editor-font-size'

function FontSizeControls() {
  const { setTextEditorContext } = useTextEditorContext('FontSizeControls')

  const [fontSize = DEFAULT_FONT_SIZE, setStorageFontSize] =
    useLocalStorage<number>(FONT_SIZE_STORAGE_KEY)

  const handleSizeChange = (newSize: number) => {
    setStorageFontSize(newSize)
  }

  useEffect(() => {
    setTextEditorContext((prev) => ({
      ...prev,
      fontSize
    }))
  }, [fontSize, setTextEditorContext])

  return (
    <div className='text-editor-font-size-controls'>
      <Tooltip data='Decrease Font Size'>
        <div>
          <IconButton
            disabled={fontSize <= MIN_FONT_SIZE}
            onClick={() => handleSizeChange(fontSize - FONT_SIZE_STEP)}
          >
            <FontSizeReduce />
          </IconButton>
        </div>
      </Tooltip>
      <Tooltip data='Increase Font Size'>
        <div>
          <IconButton
            disabled={fontSize >= MAX_FONT_SIZE}
            onClick={() => handleSizeChange(fontSize + FONT_SIZE_STEP)}
          >
            <FontSizeEnlarge />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  )
}

export default FontSizeControls
