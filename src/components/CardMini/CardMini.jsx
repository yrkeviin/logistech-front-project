import React from 'react'
import styles from './CardMini.module.css'

export default function CardMini({icon, number, description}) {
  return (
    <div className={styles.card}>
      <img src={icon} alt="" />

      <div className={styles.info}>
        <h1>{number}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}
