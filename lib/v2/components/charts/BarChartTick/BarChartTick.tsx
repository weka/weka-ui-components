import { EMPTY_STRING } from '#v2/utils/consts'
import { truncateText } from '#v2/utils/textUtils'

interface BarChartTickProps {
  x: number
  y: number
  payload: { value: string }
}

const MAX_LABEL_LENGTH = 13
const TICK_FONT_SIZE = 11
const TOOLTIP_OFFSET_PX = 10
const tooltipId = 'chart-tick-tooltip'

function getTooltipElement() {
  let el = document.getElementById(tooltipId)
  if (!el) {
    el = document.createElement('div')
    el.id = tooltipId
    el.style.position = 'fixed'
    el.style.pointerEvents = 'none'
    el.style.background = 'var(--bg-primary)'
    el.style.border = '1px solid var(--gray-600-400)'
    el.style.color = 'var(--text-primary)'
    el.style.padding = '4px 8px'
    el.style.fontSize = '11px'
    el.style.zIndex = '9999'
    el.style.whiteSpace = 'nowrap'
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.1s ease'
    document.body.appendChild(el)
  }
  return el
}

function showTooltip(text: string, x: number, y: number) {
  const el = getTooltipElement()
  el.textContent = text
  el.style.left = `${x}px`
  el.style.top = `${y - TOOLTIP_OFFSET_PX}px`
  el.style.opacity = '1'
}

function hideTooltip() {
  const el = document.getElementById(tooltipId)
  if (el) {
    el.style.opacity = '0'
  }
}

/**
 * Recharts X-axis tick for category bar charts: rotated -45°, truncated to 13
 * chars, with a floating tooltip showing the full label on hover when truncated.
 */
export function BarChartTick({ x, y, payload }: Readonly<BarChartTickProps>) {
  const fullText = String(payload?.value || EMPTY_STRING)
  const truncatedText = truncateText(fullText, MAX_LABEL_LENGTH)
  const needsTooltip = fullText.length > MAX_LABEL_LENGTH

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dx={-8}
        dy={4}
        fill='var(--text-secondary)'
        fontSize={TICK_FONT_SIZE}
        onMouseLeave={hideTooltip}
        textAnchor='end'
        transform='rotate(-45)'
        onMouseEnter={(e) => {
          if (!needsTooltip) {
            return
          }
          const rect = (e.target as SVGTextElement).getBoundingClientRect()
          showTooltip(fullText, rect.x + rect.width / 2, rect.y)
        }}
      >
        {truncatedText}
      </text>
    </g>
  )
}
