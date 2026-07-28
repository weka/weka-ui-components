import clsx from 'clsx'

import styles from './select.module.scss'

export function SearchLoadingSpinner({
  visible
}: Readonly<{ visible: boolean }>) {
  if (!visible) {
    return null
  }
  return (
    <span
      className={clsx(styles.loadingSpinner, styles.searchLoadingSpinner)}
      data-testid='select-search-loading'
    />
  )
}
