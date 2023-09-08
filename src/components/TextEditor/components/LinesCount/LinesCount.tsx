import React from 'react'
import { useTextEditorContext } from '../../context'

function LinesCount() {
  const {
    value: { totalLinesCount, visibleLinesCount = totalLinesCount }
  } = useTextEditorContext('LinesCount')

  return (
    <>
      {typeof totalLinesCount === 'number' && (
        <div className='label-2'>
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
