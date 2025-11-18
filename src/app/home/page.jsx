'use client'
import React, { useState, useEffect } from 'react'
import HeaderAdm from "../../components/HeaderAdm/HeaderAdm"
import styles from './page.module.css'

export default function HomeAdm() {
  const [stats, setStats] = useState({
    pendentes: 0,
    emRota: 0,
    entregues: 0,
    totalPedidos: 0
  })

  const [isLoaded, setIsLoaded] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)

  // Função para buscar estatísticas
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/usuarios/estatisticas')
      const data = await response.json()
      
      if (response.ok) {
        setStats({
          pendentes: data.entregas_por_status?.pendente || 0,
          emRota: data.entregas_por_status?.em_rota || 0,
          entregues: data.entregas_por_status?.entregue || 0,
          totalPedidos: data.sistema?.pedidos || 0
        })
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }
  
  // Dados de rastreamento em tempo real
  const [trackingData] = useState([
    {
      id: 1,
      numeroPedido: "PED-2024-025",
      cliente: "Carlos Eduardo Silva",
      motorista: "Ricardo Gomes",
      veiculo: "Mercedes Sprinter - ABC-5678",
      origem: "Centro de Distribuição - Vila Olímpia",
      destino: "Rua Augusta, 1250 - Cerqueira César, São Paulo - SP",
      distanciaTotal: "12.5 km",
      distanciaPercorrida: "8.2 km",
      percentualConcluido: 66,
      tempoEstimado: "18 min",
      horaInicio: "15:20",
      horaEstimadaChegada: "16:05",
      velocidadeAtual: "35 km/h",
      ultimaAtualizacao: "15:52",
      status: "Em trânsito",
      observacoes: "Trânsito normal na região"
    },
    {
      id: 2,
      numeroPedido: "PED-2024-028",
      cliente: "Ana Beatriz Costa",
      motorista: "Thiago Cardoso",
      veiculo: "Fiat Ducato - XYZ-9012",
      origem: "Centro de Distribuição - Mooca",
      destino: "Av. Paulista, 2000 - Bela Vista, São Paulo - SP",
      distanciaTotal: "15.3 km",
      distanciaPercorrida: "11.8 km",
      percentualConcluido: 77,
      tempoEstimado: "12 min",
      horaInicio: "14:45",
      horaEstimadaChegada: "16:00",
      velocidadeAtual: "42 km/h",
      ultimaAtualizacao: "15:53",
      status: "Próximo ao destino",
      observacoes: "Cliente confirmou recebimento"
    },
    {
      id: 3,
      numeroPedido: "PED-2024-031",
      cliente: "Roberto Santos Lima",
      motorista: "Felipe Araújo",
      veiculo: "Iveco Daily - DEF-3456",
      origem: "Centro de Distribuição - Santo André",
      destino: "Rua das Palmeiras, 856 - Vila Mariana, São Paulo - SP",
      distanciaTotal: "22.1 km",
      distanciaPercorrida: "6.5 km",
      percentualConcluido: 29,
      tempoEstimado: "35 min",
      horaInicio: "15:35",
      horaEstimadaChegada: "16:40",
      velocidadeAtual: "28 km/h",
      ultimaAtualizacao: "15:51",
      status: "Trânsito lento",
      observacoes: "Congestionamento na Marginal"
    }
  ])

  const [relatorioData] = useState({
    periodo: "Novembro 2024",
    totalEntregas: 145,
    entregasHoje: 12,
    entregasOntem: 18,
    entregasSemana: 89,
    entregasMes: 145,
    tempoMedioEntrega: "1h 45min",
    taxaSucesso: "97.8%",
    valorTotalEntregues: "R$ 186.450,00",
    motoristaMaisAtivo: "João Carlos Pereira",
    entregasMotoristaMaisAtivo: 23,
    regiaoMaisAtendida: "Zona Sul - São Paulo",
    entregasRegiao: 45,
    avaliacaoMedia: "4.8/5.0",
    reclamacoes: 3,
    elogios: 28
  })

  const handleOpenReportModal = () => {
    setReportModalOpen(true)
  }

  const handleCloseReportModal = () => {
    setReportModalOpen(false)
  }

  const handleOpenTrackingModal = () => {
    setTrackingModalOpen(true)
  }

  const handleCloseTrackingModal = () => {
    setTrackingModalOpen(false)
  }

  useEffect(() => {
    setIsLoaded(true)
    fetchStats()
    
    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
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
              <button className={styles.actionBtn}>Ver Detalhes</button>
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
              <button className={styles.actionBtn2} onClick={handleOpenTrackingModal}>Acompanhar</button>
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
              <button className={styles.actionBtn3} onClick={handleOpenReportModal}>Relatório</button>
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

      {reportModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseReportModal}>
          <div className={styles.reportModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Relatório de Entregas</h2>
              <button className={styles.closeButton} onClick={handleCloseReportModal}>
                <span>×</span>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.reportSection}>
                <div className={styles.sectionHeader}>
                  <h3>Resumo do Período - {relatorioData.periodo}</h3>
                </div>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData.totalEntregas}</div>
                    <div className={styles.statLabel}>Total de Entregas</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData.entregasHoje}</div>
                    <div className={styles.statLabel}>Entregas Hoje</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData.entregasSemana}</div>
                    <div className={styles.statLabel}>Esta Semana</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData.taxaSucesso}</div>
                    <div className={styles.statLabel}>Taxa de Sucesso</div>
                  </div>
                </div>
              </div>

              <div className={styles.reportSection}>
                <div className={styles.sectionHeader}>
                  <h3>Performance e Eficiência</h3>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Tempo Médio de Entrega:</span>
                    <span className={styles.infoValue}>{relatorioData.tempoMedioEntrega}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Valor Total Entregue:</span>
                    <span className={`${styles.infoValue} ${styles.valueHighlight}`}>{relatorioData.valorTotalEntregues}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Avaliação Média:</span>
                    <span className={`${styles.infoValue} ${styles.ratingHighlight}`}>{relatorioData.avaliacaoMedia}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Total de Reclamações:</span>
                    <span className={styles.infoValue}>{relatorioData.reclamacoes}</span>
                  </div>
                </div>
              </div>

              <div className={styles.reportSection}>
                <div className={styles.sectionHeader}>
                  <h3>Destaques do Período</h3>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Motorista Mais Ativo:</span>
                    <span className={styles.infoValue}>{relatorioData.motoristaMaisAtivo}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Entregas do Motorista:</span>
                    <span className={styles.infoValue}>{relatorioData.entregasMotoristaMaisAtivo}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Região Mais Atendida:</span>
                    <span className={styles.infoValue}>{relatorioData.regiaoMaisAtendida}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Entregas na Região:</span>
                    <span className={styles.infoValue}>{relatorioData.entregasRegiao}</span>
                  </div>
                </div>
              </div>

              <div className={styles.reportSection}>
                <div className={styles.sectionHeader}>
                  <h3>Feedback dos Clientes</h3>
                </div>
                <div className={styles.feedbackGrid}>
                  <div className={styles.feedbackCard}>
                    <div className={styles.feedbackNumber}>{relatorioData.elogios}</div>
                    <div className={styles.feedbackLabel}>Elogios Recebidos</div>
                    <div className={styles.feedbackStatus}>Positivo</div>
                  </div>
                  <div className={styles.feedbackCard}>
                    <div className={styles.feedbackNumber}>{relatorioData.reclamacoes}</div>
                    <div className={styles.feedbackLabel}>Reclamações</div>
                    <div className={styles.feedbackStatus}>Para Revisar</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalActionBtn} onClick={handleCloseReportModal}>
                Fechar
              </button>
              <button className={styles.modalPrimaryBtn}>
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rastreamento em Tempo Real */}
      {trackingModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseTrackingModal}>
          <div className={styles.trackingModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Rastreamento em Tempo Real</h2>
              <button className={styles.closeButton} onClick={handleCloseTrackingModal}>
                <span>×</span>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.trackingHeader}>
                <div className={styles.statusIndicator}>
                  <span className={styles.liveIndicator}></span>
                  <span className={styles.liveText}>Ao Vivo</span>
                </div>
                <div className={styles.lastUpdate}>
                  Última atualização: {new Date().toLocaleTimeString('pt-BR')}
                </div>
              </div>

              {/* Lista de Entregas em Andamento */}
              <div className={styles.trackingList}>
                {trackingData.map((entrega, index) => (
                  <div key={entrega.id} className={`${styles.trackingCard} ${index === 0 ? styles.priority : ''}`}>
                    <div className={styles.trackingCardHeader}>
                      <div className={styles.orderInfo}>
                        <h3 className={styles.orderNumber}>{entrega.numeroPedido}</h3>
                        <span className={styles.customerName}>{entrega.cliente}</span>
                      </div>
                      <div className={styles.statusBadge} data-status={entrega.status.toLowerCase().replace(' ', '-')}>
                        {entrega.status}
                      </div>
                    </div>

                    <div className={styles.progressSection}>
                      <div className={styles.progressInfo}>
                        <span className={styles.progressText}>
                          {entrega.distanciaPercorrida} de {entrega.distanciaTotal}
                        </span>
                        <span className={styles.progressPercentage}>
                          {entrega.percentualConcluido}%
                        </span>
                      </div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{width: `${entrega.percentualConcluido}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className={styles.trackingDetails}>
                      <div className={styles.routeInfo}>
                        <div className={styles.locationItem}>
                          <span className={styles.locationLabel}>Origem:</span>
                          <span className={styles.locationValue}>{entrega.origem}</span>
                        </div>
                        <div className={styles.locationItem}>
                          <span className={styles.locationLabel}>Destino:</span>
                          <span className={styles.locationValue}>{entrega.destino}</span>
                        </div>
                      </div>

                      <div className={styles.deliveryInfo}>
                        <div className={styles.infoRow}>
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Motorista:</span>
                            <span className={styles.infoValue}>{entrega.motorista}</span>
                          </div>
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Veículo:</span>
                            <span className={styles.infoValue}>{entrega.veiculo}</span>
                          </div>
                        </div>
                        <div className={styles.infoRow}>
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Velocidade:</span>
                            <span className={styles.infoValue}>{entrega.velocidadeAtual}</span>
                          </div>
                          <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Chegada Estimada:</span>
                            <span className={styles.infoValue}>{entrega.horaEstimadaChegada}</span>
                          </div>
                        </div>
                      </div>

                      {entrega.observacoes && (
                        <div className={styles.observationsBox}>
                          <span className={styles.obsLabel}>Observações:</span>
                          <span className={styles.obsText}>{entrega.observacoes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalActionBtn} onClick={handleCloseTrackingModal}>
                Fechar
              </button>
              <button className={styles.modalPrimaryBtn}>
                Atualizar Posições
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
