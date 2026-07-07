import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'

import {
  ErrorIcon,
  InfoIcon,
  LoadingIcon,
  SuccessIcon,
  WarningIcon
} from './ToastIcons'

import './toaster.scss'

const TOAST_GAP = 8
const TOAST_OFFSET = 64
const TOAST_DURATION_MS = 4000
const TOAST_POSITION: ToasterProps['position'] = 'top-right'

/**
 * App-root toaster built on `sonner`, styled for the v2 theme. Mount once near
 * the root of the app; fire toasts with the `toast*` helpers from
 * `@weka/weka-ui-components/v2`. Light/dark follows the app's `data-theme` CSS
 * variables (like every other v2 component) — no theme prop needed.
 */
export function Toaster() {
  return (
    <SonnerToaster
      closeButton
      expand
      gap={TOAST_GAP}
      offset={TOAST_OFFSET}
      position={TOAST_POSITION}
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        info: <InfoIcon />,
        loading: <LoadingIcon />
      }}
      toastOptions={{
        duration: TOAST_DURATION_MS
      }}
    />
  )
}
