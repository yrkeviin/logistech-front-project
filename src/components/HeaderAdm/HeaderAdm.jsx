'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './HeaderAdm.module.css'

export default function HeaderAdm() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div className={styles.header}>
        <img className={styles.logo} src="/image/logoAdm.png" alt="" />

        <h1>LOGISTECH</h1>

        <ul>
            <li><a href="/home">Dashboard</a></li>
            <li><a href="/entregas">Entregas</a></li>
            <li><a href="/motoristas">Motoristas</a></li>
        </ul>

        <button onClick={handleLogout} className={styles.btnSair}>
          Sair
        </button>
    </div>
  )
}
