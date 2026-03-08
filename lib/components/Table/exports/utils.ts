import type { ColumnDef, ColumnHelper } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'

import type { IconButtonCellOptions } from './cells'
import { IconButtonCell } from './cells'

export const createColumnHelperWithAction: <Data>() => ColumnHelper<Data> & {
  action: (actionDef: IconButtonCellOptions<Data>) => ColumnDef<Data, unknown>
} = <Data>() => {
  const columnHelper = createColumnHelper<Data>()

  let lastIdForAction = 0

  return {
    ...columnHelper,
    action: (action) =>
      columnHelper.display({
        id: `action_column_${lastIdForAction++}`,
        cell: IconButtonCell,
        enableResizing: false,
        meta: {
          _type: 'action',
          cell: {
            type: 'IconButtonCell',
            options: action
          }
        }
      })
  }
}
