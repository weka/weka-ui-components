import {
  cloneElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useCallback,
  useState
} from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

import { EmptyChartState } from '../../EmptyChartState'
import { LoadingState, STATE_TYPES } from '../../LoadingState'
import { StableChartContainer } from '../StableChartContainer'

export interface GradientDefinition {
  id: string
  element: ReactElement
}

const EMPTY_GRADIENTS: GradientDefinition[] = []
const STROKE_NONE = 'none'

export interface PieChartDataItem {
  name?: string
  value: number
  color?: string
  [key: string]: unknown
}

export interface BasePieChartProps {
  data: PieChartDataItem[]
  dataKey?: string
  nameKey?: string
  isLoading?: boolean
  isError?: boolean
  noData?: boolean
  innerRadius?: number
  outerRadius?: number
  cx?: string | number
  cy?: string | number
  startAngle?: number
  endAngle?: number
  paddingAngle?: number
  gradients?: GradientDefinition[]
  tooltip?: ReactElement
  children?: ReactNode
  label?: ComponentProps<typeof Pie>['label']
  labelLine?: boolean
  strokeColor?: string
  strokeWidth?: number
}

export function BasePieChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  isLoading = false,
  isError = false,
  noData = false,
  innerRadius = 60,
  outerRadius = 100,
  cx = '50%',
  cy = '50%',
  startAngle = 90,
  endAngle = 450,
  paddingAngle = 0,
  gradients = EMPTY_GRADIENTS,
  tooltip,
  children,
  label,
  labelLine = false,
  strokeColor = 'var(--ld-container-bg)',
  strokeWidth = 3
}: Readonly<BasePieChartProps>) {
  const [animate, setAnimate] = useState(true)
  const handleAnimationEnd = useCallback(() => setAnimate(false), [])
  if (isLoading) {
    return <LoadingState type={STATE_TYPES.LOADING} />
  }

  if (isError) {
    return <LoadingState type={STATE_TYPES.ERROR} />
  }

  if (noData) {
    return <EmptyChartState />
  }

  return (
    <StableChartContainer>
      <PieChart>
        {gradients.length > 0 && (
          <defs>
            {gradients.map((gradient, index) =>
              cloneElement(gradient.element, {
                key: `gradient-${gradient.id}-${index}`
              })
            )}
          </defs>
        )}
        <Pie
          cx={cx}
          cy={cy}
          data={data}
          dataKey={dataKey}
          endAngle={endAngle}
          innerRadius={innerRadius}
          isAnimationActive={animate}
          nameKey={nameKey}
          onAnimationEnd={handleAnimationEnd}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          startAngle={startAngle}
          {...(label && { label })}
          labelLine={labelLine}
        >
          {data.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              stroke={data.length === 1 ? STROKE_NONE : strokeColor}
              strokeWidth={data.length === 1 ? 0 : strokeWidth}
              fill={
                gradients[index]
                  ? `url(#${gradients[index].id})`
                  : 'var(--blue-500)'
              }
            />
          ))}
        </Pie>
        {tooltip ? (
          <Tooltip
            content={tooltip}
            wrapperStyle={{ outline: 'none' }}
          />
        ) : null}
        {children}
      </PieChart>
    </StableChartContainer>
  )
}
