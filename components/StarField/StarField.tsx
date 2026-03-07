'use client'
import styles from './StarField.module.css'

export function StarField() {
  return (
    <div
      className={styles.starField}
      aria-hidden="true"
      data-testid="star-field"
    >
      <div className={styles.layer1} />
      <div className={styles.layer2} />
      <div className={styles.layer3} />
    </div>
  )
}
