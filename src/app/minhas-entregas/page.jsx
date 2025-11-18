'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import HeaderMotorista from '../../components/HeaderMotorista/HeaderMotorista';
import { useRouter } from 'next/navigation';

export default function MinhasEntregas() {
  const router = useRouter();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motorista, setMotorista] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    // Verificar autenticação
    const motoristaData = localStorage.getItem('motorista');
    if (!motoristaData) {
      router.push('/login-motorista');
      return;
    }

    const motoristaObj = JSON.parse(motoristaData);
    setMotorista(motoristaObj);
    fetchEntregas(motoristaObj.id);
  }, [filtroStatus]);

  const fetchEntregas = async (motoristaId) => {
    try {
      setLoading(true);
      let url = `/api/entregas?motorista_id=${motoristaId}`;
      if (filtroStatus) {
        url += `&status=${filtroStatus}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      // Ordenar entregas: PENDENTE primeiro, depois EM_ROTA, depois ENTREGUE
      const ordenadas = data.sort((a, b) => {
        const ordem = { 'PENDENTE': 1, 'EM_ROTA': 2, 'ENTREGUE': 3 };
        return ordem[a.status] - ordem[b.status];
      });

      setEntregas(ordenadas);
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhes = (entregaId) => {
    router.push(`/entrega/${entregaId}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDENTE': return styles.statusPENDENTE;
      case 'EM_ROTA': return styles.statusEM_ROTA;
      case 'ENTREGUE': return styles.statusENTREGUE;
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDENTE': return '⏳';
      case 'EM_ROTA': return '🚚';
      case 'ENTREGUE': return '✅';
      default: return '📦';
    }
  };

  const entregasHoje = entregas.filter(e => {
    const hoje = new Date().toDateString();
    const dataEntrega = new Date(e.atribuido_em).toDateString();
    return hoje === dataEntrega;
  });

  const estatisticas = {
    total: entregas.length,
    hoje: entregasHoje.length,
    pendentes: entregas.filter(e => e.status === 'PENDENTE').length,
    emRota: entregas.filter(e => e.status === 'EM_ROTA').length,
    entregues: entregas.filter(e => e.status === 'ENTREGUE').length
  };

  return (
    <div className={styles.container}>
      <HeaderMotorista />

      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>Minhas Entregas</h1>
            {motorista && (
              <p className={styles.welcome}>Olá, {motorista.nome.split(' ')[0]}! 👋</p>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{estatisticas.total}</div>
              <div className={styles.statLabel}>Total de Entregas</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{estatisticas.hoje}</div>
              <div className={styles.statLabel}>Entregas Hoje</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statPendente}`}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{estatisticas.pendentes}</div>
              <div className={styles.statLabel}>Pendentes</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statEmRota}`}>
            <div className={styles.statIcon}>🚚</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{estatisticas.emRota}</div>
              <div className={styles.statLabel}>Em Rota</div>
            </div>
          </div>

          <div className={`${styles.statCard} ${styles.statEntregue}`}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{estatisticas.entregues}</div>
              <div className={styles.statLabel}>Entregues</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filtroStatus === '' ? styles.active : ''}`}
            onClick={() => setFiltroStatus('')}
          >
            Todas
          </button>
          <button
            className={`${styles.filterBtn} ${filtroStatus === 'PENDENTE' ? styles.active : ''}`}
            onClick={() => setFiltroStatus('PENDENTE')}
          >
            ⏳ Pendentes
          </button>
          <button
            className={`${styles.filterBtn} ${filtroStatus === 'EM_ROTA' ? styles.active : ''}`}
            onClick={() => setFiltroStatus('EM_ROTA')}
          >
            🚚 Em Rota
          </button>
          <button
            className={`${styles.filterBtn} ${filtroStatus === 'ENTREGUE' ? styles.active : ''}`}
            onClick={() => setFiltroStatus('ENTREGUE')}
          >
            ✅ Entregues
          </button>
        </div>

        {/* Lista de Entregas */}
        {loading ? (
          <div className={styles.loading}>Carregando entregas...</div>
        ) : entregas.length === 0 ? (
          <div className={styles.noData}>
            <div className={styles.noDataIcon}>📭</div>
            <h3>Nenhuma entrega encontrada</h3>
            <p>Você não tem entregas no momento</p>
          </div>
        ) : (
          <div className={styles.entregasList}>
            {entregas.map((entrega) => (
              <div key={entrega.id} className={styles.entregaCard}>
                <div className={styles.entregaHeader}>
                  <div className={styles.entregaId}>
                    <span className={styles.icon}>{getStatusIcon(entrega.status)}</span>
                    Entrega #{entrega.id}
                  </div>
                  <span className={`${styles.statusBadge} ${getStatusClass(entrega.status)}`}>
                    {entrega.status.replace('_', ' ')}
                  </span>
                </div>

                <div className={styles.entregaInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>📋 Pedido:</span>
                    <span className={styles.value}>{entrega.pedido?.numero_pedido}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>👤 Cliente:</span>
                    <span className={styles.value}>{entrega.pedido?.cliente?.nome}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>📍 Endereço:</span>
                    <span className={styles.value}>{entrega.pedido?.endereco_cliente}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>💰 Valor:</span>
                    <span className={styles.value}>R$ {entrega.pedido?.valor_total}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>🚐 Veículo:</span>
                    <span className={styles.value}>{entrega.veiculo?.placa} - {entrega.veiculo?.modelo}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.label}>📅 Atribuído em:</span>
                    <span className={styles.value}>
                      {new Date(entrega.atribuido_em).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {entrega.entregue_em && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>✅ Entregue em:</span>
                      <span className={styles.value}>
                        {new Date(entrega.entregue_em).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.entregaActions}>
                  <button
                    onClick={() => handleVerDetalhes(entrega.id)}
                    className={styles.btnDetalhes}
                  >
                    Ver Detalhes e Mapa 🗺️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
