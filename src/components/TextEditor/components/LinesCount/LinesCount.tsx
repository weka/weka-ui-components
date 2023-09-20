import React from 'react'
import { useTextEditorContext } from '../../context'
import clsx from 'clsx'

import './linesCount.scss'

function LinesCount() {
  const {
    value: { totalLinesCount, visibleLinesCount = totalLinesCount }
  } = useTextEditorContext('LinesCount')

  return (
    <>
      {typeof totalLinesCount === 'number' && (
        <div className={clsx('label-2', 'text-editor-lines-count')}>
          <div>
            <span>Total lines: </span>
            <span>{totalLinesCount}</span>
          </div>
          <div>
            <span>Showing: </span>
            {typeof totalLinesCount === 'number' && (
              <span>
                {visibleLinesCount === totalLinesCount
                  ? 'All lines'
                  : visibleLinesCount}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default LinesCount
