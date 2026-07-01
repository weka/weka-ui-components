import styles from './spinner.module.scss'

const DOT_COUNT = 4

export function Spinner() {
  return (
    <div className={styles.spinner}>
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <div
          key={i}
          className={styles.spinnerDot}
        />
      ))}
    </div>
  )
}
