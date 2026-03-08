import React from 'react'
import clsx from 'clsx'

import SpanTooltip from '../../../SpanTooltip'
import { useTextEditorContext } from '../../context'

import './linesCount.scss'

function LinesCount() {
  const {
    value: { totalLinesCount, visibleLinesCount = totalLinesCount, loading }
  } = useTextEditorContext('LinesCount')

  return (
    <>
      {typeof totalLinesCount === 'number' && !loading && (
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
