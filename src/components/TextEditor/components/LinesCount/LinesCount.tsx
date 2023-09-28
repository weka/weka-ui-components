import React from 'react'
import { useTextEditorContext } from '../../context'
import clsx from 'clsx'

import './linesCount.scss'
import SpanTooltip from '../../../SpanTooltip'

function LinesCount() {
  const {
    value: { totalLinesCount, visibleLinesCount = totalLinesCount }
  } = useTextEditorContext('LinesCount')

  return (
    <>
      {typeof totalLinesCount === 'number' && (
        <div className={clsx('label-2', 'text-editor-lines-count')}>
          <div>
            <SpanTooltip>{`Total lines: ${totalLinesCount}`}</SpanTooltip>
          </div>
          {typeof totalLinesCount === 'number' && (
            <div>
              <SpanTooltip>
                {`Showing: ${
                  visibleLinesCount === totalLinesCount
                    ? 'All lines'
                    : visibleLinesCount
                }`}
              </SpanTooltip>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default LinesCount
