import React from 'react'
import styles from './HeaderAdm.module.css'

export default function HeaderAdm() {
  return (
    <div className={styles.header}>
        <img className={styles.logo} src="/image/logoAdm.png" alt="" />

        <h1>LOGISTECH</h1>

        <ul>
            <li><a href="">Dashboard</a></li>
            <li><a href="">Gestão</a></li>
            <li><a href="">Usuário</a></li>
        </ul>
    </div>
  )
}
