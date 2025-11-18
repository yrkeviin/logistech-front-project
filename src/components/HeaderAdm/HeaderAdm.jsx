import React from 'react'
import styles from './HeaderAdm.module.css'

export default function HeaderAdm() {
  return (
    <div className={styles.header}>
        <img className={styles.logo} src="/image/logoAdm.png" alt="" />

        <h1>LOGISTECH</h1>

        <ul>
            <li><a href="/home">Dashboard</a></li>
            <li><a href="/entregas">Entregas</a></li>
            <li><a href="/motoristas">Motoristas</a></li>
            <li><a href="/user">Usuários</a></li>
        </ul>
    </div>
  )
}
