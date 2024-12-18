import React from 'react'
import type { Row } from '@tanstack/react-table'

import TextEditor from '../TextEditor'

import './jsonSubRow.scss'

interface JsonSubRowProps<Data> {
  row: Row<Data>
}

function JsonSubRow<Data>({ row }: JsonSubRowProps<Data>) {
  return (
    <div>
      <TextEditor
        value={JSON.stringify(row.original, null, 2)}
        extraClass='jsonSubRow'
        readOnly
        maxLines={Infinity}
      />
    </div>
  )
}

export default JsonSubRow
