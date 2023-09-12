import React, { useEffect } from 'react'
import { useTextEditorContext } from '../../context'
import { useLocalStorage } from 'react-use'
import { ThinArrow } from '../../../../svgs'
import { IconButton } from '@mui/material'

import './fontSizeControls.scss'
import Tooltip from '../../../Tooltip/Tooltip'

const DEFAULT_FONT_SIZE = 16
const MIN_FONT_SIZE = 10
const MAX_FONT_SIZE = 30
const FONT_SIZE_STEP = 2

const STORAGE_KEY = 'text-editor-font-size'
function FontSizeControls() {
  const { setTextEditorContext } = useTextEditorContext('FontSizeControls')

  const [fontSize = DEFAULT_FONT_SIZE, setStorageFontSize] =
    useLocalStorage<number>(STORAGE_KEY)

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
        <IconButton
          disabled={fontSize <= MIN_FONT_SIZE}
          onClick={() => handleSizeChange(fontSize - FONT_SIZE_STEP)}
          style={{ transform: 'rotate(90deg)' }}
        >
          <ThinArrow />
        </IconButton>
      </Tooltip>
      <Tooltip data='Increase Font Size'>
        <IconButton
          disabled={fontSize >= MAX_FONT_SIZE}
          onClick={() => handleSizeChange(fontSize + FONT_SIZE_STEP)}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <ThinArrow />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default FontSizeControls
