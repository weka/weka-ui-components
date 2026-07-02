import type { CellContext } from '@tanstack/react-table'
import type { Severity } from '#v2/utils/consts'

import { SeverityChip } from '../../SeverityChip'

export function SeverityCell<TData>({
  cell
}: Readonly<CellContext<TData, string>>) {
  return <SeverityChip severity={cell.getValue() as Severity} />
}
