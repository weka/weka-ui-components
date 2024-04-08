import { Utils } from '../../../../..'
import { EMPTY_STRING } from '../../../../../consts'
import { ExtendedCellProps, TData } from '../../../types'

function AggregatedTotalCell<Data>(props: ExtendedCellProps<Data>) {
  const { row, column } = props

  const count = row.getLeafRows().reduce<Set<unknown>>((acc, item) => {
    const value = item.getValue(column.id)

    if (!Utils.isEmpty(value)) {
      acc.add(value)
    }

    return acc
  }, new Set()).size

  return typeof count === 'number' ? `${count} (total)` : EMPTY_STRING
}

export default AggregatedTotalCell
