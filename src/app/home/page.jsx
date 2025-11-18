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
  const [pendingModalOpen, setPendingModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)
  
  const [pedidosPendentes] = useState([
    {
      id: 1,
      numero_pedido: "PED-2024-001",
      cliente: {
        nome: "Maria Silva Santos"
      }
    },
    {
      id: 2,
      numero_pedido: "PED-2024-002",
      cliente: {
        nome: "Carlos Eduardo Oliveira"
      }
    },
    {
      id: 3,
      numero_pedido: "PED-2024-003",
      cliente: {
        nome: "Ana Beatriz Costa"
      }
    },
    {
      id: 4,
      numero_pedido: "PED-2024-004",
      cliente: {
        nome: "Roberto Santos Lima"
      }
    },
    {
      id: 5,
      numero_pedido: "PED-2024-005",
      cliente: {
        nome: "Fernanda Almeida Silva"
      }
    },
    {
      id: 6,
      numero_pedido: "PED-2024-006",
      cliente: {
        nome: "João Pedro Martins"
      }
    },
    {
      id: 7,
      numero_pedido: "PED-2024-007",
      cliente: {
        nome: "Juliana Ferreira Santos"
      }
    },
    {
      id: 8,
      numero_pedido: "PED-2024-008",
      cliente: {
        nome: "Lucas Henrique Silva"
      }
    },
    {
      id: 9,
      numero_pedido: "PED-2024-009",
      cliente: {
        nome: "Patricia Oliveira Lima"
      }
    },
    {
      id: 10,
      numero_pedido: "PED-2024-010",
      cliente: {
        nome: "Rafael Costa Santos"
      }
    },
    {
      id: 11,
      numero_pedido: "PED-2024-011",
      cliente: {
        nome: "Camila Rodrigues"
      }
    },
    {
      id: 12,
      numero_pedido: "PED-2024-012",
      cliente: {
        nome: "Diego Almeida"
      }
    }
  ])
  
  const [entregasEmRota] = useState([
    {
      id: 1,
      pedido: {
        numero_pedido: "PED-2024-025",
        endereco_cliente: "Rua Augusta, 1250 - Cerqueira César, São Paulo - SP",
        cliente: {
          nome: "Carlos Eduardo Silva"
        }
      },
      motorista: {
        nome: "Ricardo Gomes"
      }
    },
    {
      id: 2,
      pedido: {
        numero_pedido: "PED-2024-028",
        endereco_cliente: "Av. Paulista, 2000 - Bela Vista, São Paulo - SP",
        cliente: {
          nome: "Ana Beatriz Costa"
        }
      },
      motorista: {
        nome: "Thiago Cardoso"
      }
    },
    {
      id: 3,
      pedido: {
        numero_pedido: "PED-2024-031",
        endereco_cliente: "Rua das Palmeiras, 856 - Vila Mariana, São Paulo - SP",
        cliente: {
          nome: "Roberto Santos Lima"
        }
      },
      motorista: {
        nome: "Felipe Araújo"
      }
    },
    {
      id: 4,
      pedido: {
        numero_pedido: "PED-2024-034",
        endereco_cliente: "Rua Oscar Freire, 1200 - Jardins, São Paulo - SP",
        cliente: {
          nome: "Marina Souza"
        }
      },
      motorista: {
        nome: "André Silva"
      }
    },
    {
      id: 5,
      pedido: {
        numero_pedido: "PED-2024-037",
        endereco_cliente: "Av. Faria Lima, 3500 - Itaim Bibi, São Paulo - SP",
        cliente: {
          nome: "Paulo Henrique"
        }
      },
      motorista: {
        nome: "Carlos Mendes"
      }
    },
    {
      id: 6,
      pedido: {
        numero_pedido: "PED-2024-040",
        endereco_cliente: "Rua da Consolação, 890 - Consolação, São Paulo - SP",
        cliente: {
          nome: "Beatriz Lima"
        }
      },
      motorista: {
        nome: "João Santos"
      }
    },
    {
      id: 7,
      pedido: {
        numero_pedido: "PED-2024-043",
        endereco_cliente: "Av. Rebouças, 1500 - Pinheiros, São Paulo - SP",
        cliente: {
          nome: "Fernando Costa"
        }
      },
      motorista: {
        nome: "Pedro Oliveira"
      }
    },
    {
      id: 8,
      pedido: {
        numero_pedido: "PED-2024-046",
        endereco_cliente: "Rua Haddock Lobo, 600 - Cerqueira César, São Paulo - SP",
        cliente: {
          nome: "Larissa Pereira"
        }
      },
      motorista: {
        nome: "Gustavo Rodrigues"
      }
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

  const handleOpenPendingModal = () => {
    setPendingModalOpen(true)
  }

  const handleClosePendingModal = () => {
    setPendingModalOpen(false)
  }

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
              <button className={styles.actionBtn} onClick={handleOpenPendingModal}>Ver Detalhes</button>
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

      {pendingModalOpen && (
        <div className={styles.modalOverlay} onClick={handleClosePendingModal}>
          <div className={styles.pendingModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Pedidos Pendentes ({pedidosPendentes.length})</h2>
              <button className={styles.closeButton} onClick={handleClosePendingModal}>
                <span>×</span>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.pendingList}>
                {pedidosPendentes.map((pedido) => (
                  <div key={pedido.id} className={styles.pendingItem}>
                    <div className={styles.pendingItemHeader}>
                      <span className={styles.pedidoNumber}>{pedido.numero_pedido}</span>
                      <span className={styles.statusBadge}>PENDENTE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalActionBtn} onClick={handleClosePendingModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

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
            </div>
          </div>
        </div>
      )}

      {trackingModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseTrackingModal}>
          <div className={styles.trackingModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Entregas em Andamento ({entregasEmRota.length})</h2>
              <button className={styles.closeButton} onClick={handleCloseTrackingModal}>
                <span>×</span>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.trackingList}>
                {entregasEmRota.map((entrega) => (
                  <div key={entrega.id} className={styles.trackingItem}>
                    <div className={styles.trackingItemHeader}>
                      <span className={styles.pedidoNumber}>{entrega.pedido.numero_pedido}</span>
                      <span className={styles.statusBadge}>EM ROTA</span>
                    </div>
                    <div className={styles.entregaInfo}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Cliente (Recebedor):</span>
                        <span className={styles.infoValue}>{entrega.pedido.cliente.nome}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Destino:</span>
                        <span className={styles.infoValue}>{entrega.pedido.endereco_cliente}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Motorista:</span>
                        <span className={styles.infoValue}>{entrega.motorista.nome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalActionBtn} onClick={handleCloseTrackingModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
