'use client'
import React, { useState, useEffect } from 'react'
import HeaderAdm from "../../components/HeaderAdm/HeaderAdm"
import styles from './page.module.css'

export default function HomeAdm() {
  const [stats, setStats] = useState({
    pendentes: 12,
    emRota: 8,
    entregues: 145,
    totalPedidos: 165
  })

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={styles.container}>
      <HeaderAdm />

      <div className={styles.dashboard}>
        <div className={styles.decorativeElements}>
          <div className={styles.quadrados}>
            <div className={styles.quadrados1}>
              <div className={`${styles.quadrado} ${styles.quadrado1}`}></div>
              <div className={`${styles.quadrado} ${styles.quadrado2}`}></div>
            </div>
            <div className={styles.quadrados2}>
              <div className={`${styles.quadrado} ${styles.quadrado3}`}></div>
              <div className={`${styles.quadrado} ${styles.quadrado4}`}></div>
            </div>
          </div>
        </div>
        
        <div className={styles.dashboardTitle}>
          <h1>Dashboard Logístico</h1>
          <p>Visão geral das operações em tempo real</p>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={`${styles.cardStatus} ${isLoaded ? styles.fadeInUp : ''}`} style={{animationDelay: '0.1s'}}>
          <div className={styles.banner}>
            <div className={styles.cardIcon}>⏳</div>
            <div className={styles.cardContent}>
              <h1>Pendentes</h1>
              <div className={styles.cardNumber}>{stats.pendentes}</div>
            </div>
          </div>
          <div className={styles.cardBody}>
            <p>Pedidos aguardando processamento e atribuição de motorista</p>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn}>Ver Detalhes</button>
            </div>
          </div>
        </div>

        <div className={`${styles.cardStatus} ${isLoaded ? styles.fadeInUp : ''}`} style={{animationDelay: '0.3s'}}>
          <div className={styles.banner2}>
            <div className={styles.cardIcon}>🚚</div>
            <div className={styles.cardContent}>
              <h1>Em Rota</h1>
              <div className={styles.cardNumber}>{stats.emRota}</div>
            </div>
          </div>
          <div className={styles.cardBody}>
            <p>Entregas em andamento pelos nossos motoristas</p>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn2}>Acompanhar</button>
            </div>
          </div>
        </div>

        <div className={`${styles.cardStatus} ${isLoaded ? styles.fadeInUp : ''}`} style={{animationDelay: '0.5s'}}>
          <div className={styles.banner3}>
            <div className={styles.cardIcon}>✅</div>
            <div className={styles.cardContent}>
              <h1>Entregues</h1>
              <div className={styles.cardNumber}>{stats.entregues}</div>
            </div>
          </div>
          <div className={styles.cardBody}>
            <p>Entregas concluídas com sucesso</p>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn3}>Relatório</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.totalStats}>
          <h2>📈 Resumo Geral</h2>
          <div className={styles.totalCard}>
            <span className={styles.totalLabel}>Total de Pedidos Hoje:</span>
            <span className={styles.totalNumber}>{stats.totalPedidos}</span>
          </div>
        </div>
      </div>

      <div className={styles.separator}></div>
    </div>
  )
}
