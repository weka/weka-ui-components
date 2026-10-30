import type { IconButtonCellOptions } from './cells'
import type {
  CellContext,
  ColumnDef,
  ColumnDefTemplate,
  ColumnHelper
} from '@tanstack/react-table'

import { createColumnHelper } from '@tanstack/react-table'

import { IconButtonCell } from './cells'

export function createColumnHelperWithAction<Data>(): ColumnHelper<Data> & {
  action: (actionDef: IconButtonCellOptions<Data>) => ColumnDef<Data, unknown>
} {
  const columnHelper = createColumnHelper<Data>()

  let lastIdForAction = 0

  return {
    ...columnHelper,
    action: (action: IconButtonCellOptions<Data>) =>
      columnHelper.display({
        id: `action_column_${lastIdForAction++}`,
        // cells take ExtendedCellProps, the table's own view of CellContext
        cell: IconButtonCell as ColumnDefTemplate<CellContext<Data, unknown>>,
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
