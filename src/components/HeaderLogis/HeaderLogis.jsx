import React from 'react'
import styles from './HeaderLogis.module.css'

export default function HeaderLogis() {
  return (
    <div className={styles.header}>
        <img className={styles.logo} src="/image/logoLogis.png" alt="" />

        <h1>LOGISTECH</h1>

        <ul>
            <li><a href="">Entregas</a></li>
            <li><a href="">Informações</a></li>
            <li><a href="">Usuário</a></li>
        </ul>
    </div>
  )
}
