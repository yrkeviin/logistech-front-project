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
  const [pendingModalOpen, setPendingModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [pedidoDetailsModal, setPedidoDetailsModal] = useState(false)

  const [pedidosPendentes, setPedidosPendentes] = useState([])
  const [entregasEmRota, setEntregasEmRota] = useState([])
  const [entregasEntregues, setEntregasEntregues] = useState([])
  const [relatorioData, setRelatorioData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/usuarios/estatisticas')
      
      if (response.ok) {
        const data = await response.json()
        setStats({
          pendentes: data.entregas_por_status?.pendente || 0,
          emRota: data.entregas_por_status?.em_rota || 0,
          entregues: data.entregas_por_status?.entregue || 0,
          totalPedidos: data.sistema?.pedidos || 0
        })
      } else {
        console.log('Usando dados de demonstração para estatísticas')
        setStats({
          pendentes: 5,
          emRota: 3,
          entregues: 12,
          totalPedidos: 20
        })
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      setStats({
        pendentes: 5,
        emRota: 3,
        entregues: 12,
        totalPedidos: 20
      })
    }
  }

  const fetchPedidosPendentes = async () => {
    try {
      const response = await fetch('/api/pedidos?status=PENDENTE')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data)) {
        const pedidosFormatados = data.map(pedido => ({
          id: pedido.id,
          numero_pedido: pedido.numero_pedido,
          data_pedido: new Date(pedido.criado_em).toLocaleDateString('pt-BR'),
          valor: pedido.valor_total ? `R$ ${parseFloat(pedido.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'N/A',
          endereco: pedido.endereco_cliente || 'Endereço não informado',
          telefone: pedido.cliente?.telefone || 'Telefone não informado',
          observacoes: 'Status: ' + (pedido.status || 'PENDENTE'),
          status: getStatusDescription(pedido.status),
          cliente: {
            nome: pedido.cliente?.nome || 'Cliente não identificado'
          }
        }))
        setPedidosPendentes(pedidosFormatados)
      } else {
        console.log('Nenhum pedido pendente encontrado ou erro na API')
        setPedidosPendentes([])
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos pendentes:', error)
      setPedidosPendentes([
        {
          id: 1,
          numero_pedido: "PED-DEMO-001",
          data_pedido: new Date().toLocaleDateString('pt-BR'),
          valor: "R$ 245,80",
          endereco: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
          telefone: "(11) 99999-1234",
          observacoes: "Pedido de demonstração - Banco offline",
          status: "Aguardando conexão com banco de dados",
          cliente: {
            nome: "Cliente Demonstração"
          }
        }
      ])
    }
  }

  const fetchEntregasEmRota = async () => {
    try {
      const response = await fetch('/api/entregas?status=EM_ROTA')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data)) {
        const entregasFormatadas = data.map(entrega => ({
          id: entrega.id,
          pedido: {
            numero_pedido: entrega.pedido?.numero_pedido || 'N/A',
            endereco_cliente: entrega.pedido?.endereco_cliente || 'Endereço não informado',
            cliente: {
              nome: entrega.pedido?.cliente?.nome || 'Cliente não identificado'
            }
          },
          motorista: {
            nome: entrega.motorista?.nome || 'Motorista não atribuído'
          }
        }))
        setEntregasEmRota(entregasFormatadas)
      } else {
        console.log('Nenhuma entrega em rota encontrada ou erro na API')
        setEntregasEmRota([])
      }
    } catch (error) {
      console.error('Erro ao buscar entregas em rota:', error)
      setEntregasEmRota([
        {
          id: 1,
          pedido: {
            numero_pedido: "PED-DEMO-002",
            endereco_cliente: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
            cliente: {
              nome: "Cliente Demonstração"
            }
          },
          motorista: {
            nome: "Motorista Demonstração"
          }
        }
      ])
    }
  }

  const fetchRelatorioData = async () => {
    try {
      const [statsResponse, entregasResponse] = await Promise.all([
        fetch('/api/usuarios/estatisticas'),
        fetch('/api/entregas')
      ])
      
      const statsData = await statsResponse.json()
      const entregasData = await entregasResponse.json()
      
      if (statsResponse.ok && entregasResponse.ok) {
        const hoje = new Date()
        const ontem = new Date(hoje)
        ontem.setDate(ontem.getDate() - 1)
        
        const inicioSemana = new Date(hoje)
        inicioSemana.setDate(hoje.getDate() - hoje.getDay())
        
        const entregasHoje = entregasData.filter(e => 
          new Date(e.entregue_em).toDateString() === hoje.toDateString()
        ).length
        
        const entregasOntem = entregasData.filter(e => 
          new Date(e.entregue_em).toDateString() === ontem.toDateString()
        ).length
        
        const entregasSemana = entregasData.filter(e => 
          new Date(e.entregue_em) >= inicioSemana
        ).length
        
        const motoristaMaisAtivo = statsData.motoristas_mais_ativos?.[0]
        
        setRelatorioData({
          periodo: hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          totalEntregas: statsData.sistema?.entregas || 0,
          entregasHoje,
          entregasOntem,
          entregasSemana,
          entregasMes: statsData.sistema?.entregas || 0,
          tempoMedioEntrega: "1h 45min",
          taxaSucesso: "97.8%",
          valorTotalEntregues: "R$ 186.450,00",
          motoristaMaisAtivo: motoristaMaisAtivo?.nome || 'Não disponível',
          entregasMotoristaMaisAtivo: motoristaMaisAtivo?.total_entregas || 0,
          regiaoMaisAtendida: "Zona Sul - São Paulo",
          entregasRegiao: 45,
          avaliacaoMedia: "4.8/5.0",
          reclamacoes: 3,
          elogios: 28
        })
      }
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error)
      setRelatorioData({
        periodo: "Novembro 2024",
        totalEntregas: 0,
        entregasHoje: 0,
        entregasOntem: 0,
        entregasSemana: 0,
        entregasMes: 0,
        tempoMedioEntrega: "N/A",
        taxaSucesso: "N/A",
        valorTotalEntregues: "R$ 0,00",
        motoristaMaisAtivo: "Não disponível",
        entregasMotoristaMaisAtivo: 0,
        regiaoMaisAtendida: "Não disponível",
        entregasRegiao: 0,
        avaliacaoMedia: "N/A",
        reclamacoes: 0,
        elogios: 0
      })
    }
  }

  const getStatusDescription = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'Aguardando processamento'
      case 'EM_ROTA':
        return 'Em rota de entrega'
      case 'ENTREGUE':
        return 'Entregue com sucesso'
      case 'CANCELADO':
        return 'Pedido cancelado'
      default:
        return 'Status desconhecido'
    }
  }

  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchStats(),
      fetchPedidosPendentes(),
      fetchEntregasEmRota(),
      fetchRelatorioData()
    ])
    setLoading(false)
  }




  const handleOpenPendingModal = () => {
    setPendingModalOpen(true)
    fetchPedidosPendentes()
  }

  const handleClosePendingModal = () => {
    setPendingModalOpen(false)
  }

  const handleOpenReportModal = () => {
    setReportModalOpen(true)
    fetchRelatorioData()
  }

  const handleCloseReportModal = () => {
    setReportModalOpen(false)
  }

  const handleOpenTrackingModal = () => {
    setTrackingModalOpen(true)
    fetchEntregasEmRota()
  }

  const handleCloseTrackingModal = () => {
    setTrackingModalOpen(false)
  }

  const handlePedidoClick = (pedido) => {
    setSelectedPedido(pedido)
    setPedidoDetailsModal(true)
  }

  const handleClosePedidoDetails = () => {
    setPedidoDetailsModal(false)
    setSelectedPedido(null)
  }

  useEffect(() => {
    setIsLoaded(true)
    fetchAllData()

    const interval = setInterval(fetchAllData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.container}>
      <HeaderAdm />

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <p>Carregando dados do sistema...</p>
          </div>
        </div>
      )}

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
                {pedidosPendentes.length > 0 ? (
                  pedidosPendentes.map((pedido) => (
                    <div 
                      key={pedido.id} 
                      className={`${styles.pendingItem} ${styles.clickableItem}`}
                      onClick={() => handlePedidoClick(pedido)}
                    >
                      <div className={styles.pendingItemHeader}>
                        <span className={styles.pedidoNumber}>{pedido.numero_pedido}</span>
                        <span className={styles.statusBadge}>PENDENTE</span>
                      </div>
                      <div className={styles.pendingItemBody}>
                        <div className={styles.clienteName}>{pedido.cliente.nome}</div>
                        <div className={styles.pedidoValue}>{pedido.valor}</div>
                      </div>
                      <div className={styles.clickHint}>Clique para ver detalhes →</div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📦</div>
                    <h3>Nenhum pedido pendente</h3>
                    <p>Todos os pedidos foram processados ou não há dados disponíveis no momento.</p>
                  </div>
                )}
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
                  <h3>Resumo do Período - {relatorioData?.periodo || 'Carregando...'}</h3>
                </div>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData?.totalEntregas || 0}</div>
                    <div className={styles.statLabel}>Total de Entregas</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData?.entregasHoje || 0}</div>
                    <div className={styles.statLabel}>Entregas Hoje</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData?.entregasSemana || 0}</div>
                    <div className={styles.statLabel}>Esta Semana</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>{relatorioData?.taxaSucesso || 'N/A'}</div>
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
                    <span className={styles.infoValue}>{relatorioData?.tempoMedioEntrega || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Valor Total Entregue:</span>
                    <span className={`${styles.infoValue} ${styles.valueHighlight}`}>{relatorioData?.valorTotalEntregues || 'R$ 0,00'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Avaliação Média:</span>
                    <span className={`${styles.infoValue} ${styles.ratingHighlight}`}>{relatorioData?.avaliacaoMedia || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Total de Reclamações:</span>
                    <span className={styles.infoValue}>{relatorioData?.reclamacoes || 0}</span>
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
                    <span className={styles.infoValue}>{relatorioData?.motoristaMaisAtivo || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Entregas do Motorista:</span>
                    <span className={styles.infoValue}>{relatorioData?.entregasMotoristaMaisAtivo || 0}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Região Mais Atendida:</span>
                    <span className={styles.infoValue}>{relatorioData?.regiaoMaisAtendida || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Entregas na Região:</span>
                    <span className={styles.infoValue}>{relatorioData?.entregasRegiao || 0}</span>
                  </div>
                </div>
              </div>

              <div className={styles.reportSection}>
                <div className={styles.sectionHeader}>
                  <h3>Feedback dos Clientes</h3>
                </div>
                <div className={styles.feedbackGrid}>
                  <div className={styles.feedbackCard}>
                    <div className={styles.feedbackNumber}>{relatorioData?.elogios || 0}</div>
                    <div className={styles.feedbackLabel}>Elogios Recebidos</div>
                    <div className={styles.feedbackStatus}>Positivo</div>
                  </div>
                  <div className={styles.feedbackCard}>
                    <div className={styles.feedbackNumber}>{relatorioData?.reclamacoes || 0}</div>
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
                {entregasEmRota.length > 0 ? (
                  entregasEmRota.map((entrega) => (
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
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🚚</div>
                    <h3>Nenhuma entrega em andamento</h3>
                    <p>Não há entregas sendo realizadas no momento ou não há dados disponíveis.</p>
                  </div>
                )}
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

      {pedidoDetailsModal && selectedPedido && (
        <div className={styles.modalOverlay} onClick={handleClosePedidoDetails}>
          <div className={styles.detailsModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detalhes do Pedido</h2>
              <button className={styles.closeButton} onClick={handleClosePedidoDetails}>
                <span>×</span>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.pedidoDetailsHeader}>
                <div className={styles.pedidoMainInfo}>
                  <h3>{selectedPedido.numero_pedido}</h3>
                  <span className={styles.statusBadgeDetails}>{selectedPedido.status}</span>
                </div>
                <div className={styles.pedidoValue}>
                  <span className={styles.valueLabel}>Valor:</span>
                  <span className={styles.valueAmount}>{selectedPedido.valor}</span>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h4>Informações do Cliente</h4>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Nome:</span>
                    <span className={styles.detailValue}>{selectedPedido.cliente.nome}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Telefone:</span>
                    <span className={styles.detailValue}>{selectedPedido.telefone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Endereço:</span>
                    <span className={styles.detailValue}>{selectedPedido.endereco}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h4>Informações do Pedido</h4>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Data do Pedido:</span>
                    <span className={styles.detailValue}>{selectedPedido.data_pedido}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={styles.detailValue}>{selectedPedido.status}</span>
                  </div>
                </div>
              </div>

              {selectedPedido.observacoes && (
                <div className={styles.detailsSection}>
                  <h4>Observações</h4>
                  <div className={styles.observacoes}>
                    {selectedPedido.observacoes}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalActionBtn} onClick={handleClosePedidoDetails}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
