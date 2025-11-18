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
  const [modalOpen, setModalOpen] = useState(false)
  
  // Dados simulados da última entrega pendente
  const [entregaDetalhes] = useState({
    numeroPedido: "PED-2024-001",
    cliente: "Maria Silva Santos",
    endereco: "Rua das Flores, 456 - Jardim Primavera, São Paulo - SP",
    cep: "04567-890",
    telefone: "(11) 99876-5432",
    horaSaida: "14:30",
    horaEstimada: "16:15",
    motorista: "João Carlos Pereira",
    veiculo: "Fiat Ducato - Placa: ABC-1234",
    valorTotal: "R$ 1.250,00",
    observacoes: "Entrega no portão principal, tocar interfone apto 45",
    status: "Aguardando coleta"
  })

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

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
            <div className={styles.cardIcon}>PENDENTE</div>
            <div className={styles.cardContent}>
              <h1>Pendentes</h1>
              <div className={styles.cardNumber}>{stats.pendentes}</div>
            </div>
          </div>
          <div className={styles.cardBody}>
            <p>Pedidos aguardando processamento e atribuição de motorista</p>
            <div className={styles.cardActions}>
              <button className={styles.actionBtn} onClick={handleOpenModal}>Ver Detalhes</button>
            </div>
          </div>
        </div>

        <div className={`${styles.cardStatus} ${isLoaded ? styles.fadeInUp : ''}`} style={{animationDelay: '0.3s'}}>
          <div className={styles.banner2}>
            <div className={styles.cardIcon}>EM ROTA</div>
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
            <div className={styles.cardIcon}>ENTREGUE</div>
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
          <h2>Resumo Geral</h2>
          <div className={styles.totalCard}>
            <span className={styles.totalLabel}>Total de Pedidos Hoje:</span>
            <span className={styles.totalNumber}>{stats.totalPedidos}</span>
          </div>
        </div>
      </div>

      <div className={styles.separator}></div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detalhes da Entrega Pendente</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                <span>×</span>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalSection}>
                <div className={styles.sectionHeader}>
                  <h3>Informações do Pedido</h3>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Número do Pedido:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.numeroPedido}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Status:</span>
                    <span className={`${styles.infoValue} ${styles.statusPending}`}>{entregaDetalhes.status}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Valor Total:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.valorTotal}</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <div className={styles.sectionHeader}>
                  <h3>Cliente e Endereço</h3>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Nome do Cliente:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.cliente}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Telefone:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.telefone}</span>
                  </div>
                  <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                    <span className={styles.infoLabel}>Endereço:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.endereco}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>CEP:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.cep}</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalSection}>
                <div className={styles.sectionHeader}>
                  <h3>Logística e Horários</h3>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Motorista:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.motorista}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Veículo:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.veiculo}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Hora de Saída:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.horaSaida}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Previsão de Chegada:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.horaEstimada}</span>
                  </div>
                  <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                    <span className={styles.infoLabel}>Observações:</span>
                    <span className={styles.infoValue}>{entregaDetalhes.observacoes}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalActionBtn} onClick={handleCloseModal}>
                Fechar
              </button>
              <button className={styles.modalPrimaryBtn}>
                Iniciar Entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
