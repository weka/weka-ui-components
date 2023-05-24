import { OrderByFn, Row } from 'react-table'
import { Column } from '../Table'
import { Utils } from '../../..'
import { useCallback } from 'react'

function useRowGroups<Data extends Record<string, unknown>>(args: {
  sortedColumn?: string
  groupRowsBy?: string[]
  columns: Column<Data>[]
}) {
  const { sortedColumn, groupRowsBy = [], columns } = args

  const orderByFn = useCallback(
    (rows: Row<Data>[], sortFns: OrderByFn<Data>[], directions: boolean[]) => {
      const desc = directions[0]

      const getSortFunc = (
        columnId: string
      ): ((a: Row<Data>, b: Row<Data>) => number) => {
        const sortType = columns.find(({ id }) => id === columnId)?.sortType

        if (sortType === 'number') {
          return (a, b) => Utils.numberSort(a, b, columnId)
        }

        if (typeof sortType === 'function') {
          return (a, b) => sortType(a, b, columnId, desc)
        }
        return (a, b) => Utils.stringSort(a, b, columnId)
      }

      const sortRowsByGroup = (
        rowsArr: Row<Data>[],
        properties: string[]
      ): Row<Data>[] => {
        if (!sortedColumn || !groupRowsBy?.length) {
          return rowsArr
        }

        if (properties.length === 0) {
          return groupRowsBy.includes(sortedColumn)
            ? [...rowsArr].sort(getSortFunc(sortedColumn))
            : rowsArr
        }

        const currentGroup = properties[0]

        const rowsByGroupValue = rowsArr.reduce(
          (acc: Record<string, Row<Data>[]>, currentRow: Row<Data>) => {
            const groupKey = currentRow.values[currentGroup]
            if (!acc[groupKey]) {
              acc[groupKey] = []
            }
            acc[groupKey].push(currentRow)
            return acc
          },
          {}
        )

        const groupedRows: Row<Data>[][] = Object.values(rowsByGroupValue)

        const nestedGroupedRows: Row<Data>[] = []
        groupedRows.forEach((group) => {
          const remainingProperties = properties.slice(1)
          const nestedGroup = sortRowsByGroup(group, remainingProperties)

          nestedGroupedRows.push(...nestedGroup)
        })

        return nestedGroupedRows.flat(Infinity).sort(getSortFunc(currentGroup))
      }

      const sortedRows = sortRowsByGroup(rows, groupRowsBy).flat(Infinity)

      return desc ? sortedRows : sortedRows.reverse()
    },
    [columns, groupRowsBy, sortedColumn]
  )

  const getGroupedRows = useCallback(
    (rows: Row[], group: string) =>
      rows.reduce<Record<string, Row[]>>((acc, row) => {
        const groupArr = row.values[group]
        if (!acc[groupArr]) {
          acc[groupArr] = []
        }

        acc[groupArr].push(row)

        return acc
      }, {}),
    []
  )

  return { getGroupedRows, orderByFn }
}

export default useRowGroups
