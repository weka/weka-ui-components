const NO_SYNC_INDEX = -1

/**
 * Custom Recharts syncMethod that finds the nearest data point by timestamp value.
 *
 * Unlike syncMethod='value' (exact match only), this handles charts with different
 * data resolutions. It also avoids misleading cross-chart sync when the hovered
 * timestamp is outside a receiving chart's data range — returning -1 in that case
 * so the chart shows no tooltip rather than snapping to its edge data point.
 */
export function syncByNearestTimestamp(
  tooltipTicks: unknown[],
  data: unknown
): number {
  const syncData = data as { activeLabel?: string | number }
  const { activeLabel } = syncData

  if (activeLabel === undefined || activeLabel === null) {
    return NO_SYNC_INDEX
  }

  const targetTime =
    typeof activeLabel === 'number' ? activeLabel : Number(activeLabel)
  if (Number.isNaN(targetTime)) {
    return NO_SYNC_INDEX
  }

  const ticks = tooltipTicks as Array<{ value: string | number }>
  if (ticks.length === 0) {
    return NO_SYNC_INDEX
  }

  const tickTimes = ticks.map((tick) =>
    typeof tick.value === 'number' ? tick.value : Number(tick.value)
  )

  const minTime = tickTimes.reduce((acc, time) => Math.min(acc, time), Infinity)
  const maxTime = tickTimes.reduce(
    (acc, time) => Math.max(acc, time),
    -Infinity
  )

  if (targetTime < minTime || targetTime > maxTime) {
    return NO_SYNC_INDEX
  }

  let minDist = Infinity
  let closestIndex = NO_SYNC_INDEX

  tickTimes.forEach((tickTime, i) => {
    const dist = Math.abs(tickTime - targetTime)
    if (dist < minDist) {
      minDist = dist
      closestIndex = i
    }
  })

  return closestIndex
}
