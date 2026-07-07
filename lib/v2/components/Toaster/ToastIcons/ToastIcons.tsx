/* eslint-disable react/no-multi-comp -- the five toast glyphs form one cohesive icon set; keeping them together reads better than five one-line files. */
import { useId } from 'react'

import { getGradientColors } from '../../../styles/gradientColors'
import { ALERT_ICON_SHAPES, GradientAlertIcon } from '../../GradientAlertIcon'

export interface ToastIconProps {
  size?: number
}

const DEFAULT_TOAST_ICON_SIZE = 40

const SUCCESS_ICON_PATH =
  'M27 4.5C14.594 4.5 4.5 14.594 4.5 27C4.5 39.406 14.594 49.5 27 49.5C39.406 49.5 49.5 39.406 49.5 27C49.5 14.594 39.406 4.5 27 4.5ZM39.5752 21.0789L25.1955 35.3459C24.3496 36.1917 22.9962 36.2481 22.094 35.4023L14.4812 28.4662C13.5789 27.6203 13.5226 26.2105 14.312 25.3083C15.1579 24.406 16.5677 24.3496 17.4699 25.1955L23.5038 30.7218L36.3609 17.8647C37.2632 16.9624 38.6729 16.9624 39.5752 17.8647C40.4774 18.7669 40.4774 20.1767 39.5752 21.0789Z'

export function SuccessIcon({
  size = DEFAULT_TOAST_ICON_SIZE
}: Readonly<ToastIconProps>) {
  const gradientColors = getGradientColors('green')
  const gradientId = useId()

  return (
    <svg
      fill='none'
      height={size}
      viewBox='0 0 54 54'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id={gradientId}
          x1='50%'
          x2='50%'
          y1='100%'
          y2='0%'
        >
          <stop
            offset='0%'
            stopColor={gradientColors.start}
          />
          <stop
            offset='100%'
            stopColor={gradientColors.end}
          />
        </linearGradient>
      </defs>
      <path
        d={SUCCESS_ICON_PATH}
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
}

export function ErrorIcon({
  size = DEFAULT_TOAST_ICON_SIZE
}: Readonly<ToastIconProps>) {
  return (
    <GradientAlertIcon
      gradientColor='red'
      id={useId()}
      shape={ALERT_ICON_SHAPES.TRIANGLE}
      size={size}
    />
  )
}

export function WarningIcon({
  size = DEFAULT_TOAST_ICON_SIZE
}: Readonly<ToastIconProps>) {
  return (
    <GradientAlertIcon
      gradientColor='orange'
      id={useId()}
      shape={ALERT_ICON_SHAPES.TRIANGLE}
      size={size}
    />
  )
}

export function InfoIcon({
  size = DEFAULT_TOAST_ICON_SIZE
}: Readonly<ToastIconProps>) {
  return (
    <GradientAlertIcon
      gradientColor='cyan'
      id={useId()}
      shape={ALERT_ICON_SHAPES.CIRCLE}
      size={size}
    />
  )
}

export function LoadingIcon({
  size = DEFAULT_TOAST_ICON_SIZE
}: Readonly<ToastIconProps>) {
  const gradientColors = getGradientColors('purple')
  const gradientId = useId()

  return (
    <svg
      className='toastLoadingSpinner'
      fill='none'
      height={size}
      viewBox='0 0 54 54'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id={gradientId}
          x1='27'
          x2='27'
          y1='49'
          y2='5'
        >
          <stop
            offset='0%'
            stopColor={gradientColors.start}
          />
          <stop
            offset='100%'
            stopColor={gradientColors.end}
          />
        </linearGradient>
      </defs>
      <circle
        cx='27'
        cy='27'
        fill='none'
        r='20'
        stroke={`url(#${gradientId})`}
        strokeDasharray='125.66'
        strokeDashoffset='31.42'
        strokeLinecap='round'
        strokeWidth='6'
      />
    </svg>
  )
}
