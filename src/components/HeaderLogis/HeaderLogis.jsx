'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './HeaderLogis.module.css'

export default function HeaderLogis() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    router.push('/')
  }

  const handleLogoClick = () => {
    router.push('/minhas-entregas')
  }

  return (
    <div className={styles.header}>
        <img 
          className={styles.logo} 
          src="/image/logoLogis.png" 
          alt="Logo Logistech" 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />

        <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>LOGISTECH</h1>

        <ul>
            <li><a href="/minhas-entregas">Minhas Entregas</a></li>
            <li><a href="/provas-entregas">Comprovantes</a></li>
            <li><a href="/perfil-motorista">Perfil</a></li>
        </ul>

        <button onClick={handleLogout} className={styles.btnSair}>
          Sair
        </button>
    </div>
  )
}
