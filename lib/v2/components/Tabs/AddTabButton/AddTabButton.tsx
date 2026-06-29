import { PlusIcon } from '../../../icons'

import styles from '../tabs.module.scss'

interface AddTabButtonProps {
  onClick: () => void
}

export function AddTabButton({ onClick }: Readonly<AddTabButtonProps>) {
  return (
    <button
      className={styles.addTabBtn}
      data-testid='tab-add-button'
      onClick={onClick}
      title='Add Tab'
      type='button'
    >
      <PlusIcon extraClass={styles.addTabIcon} />
    </button>
  )
}
