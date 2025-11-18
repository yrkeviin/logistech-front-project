'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import HeaderMotorista from '../../../components/HeaderMotorista/HeaderMotorista';
import { useRouter } from 'next/navigation';

export default function DetalheEntrega({ params }) {
  const router = useRouter();
  const [entrega, setEntrega] = useState(null);
  const [loading, setLoading] = useState(true);
  const [motorista, setMotorista] = useState(null);
  const [showProvaModal, setShowProvaModal] = useState(false);
  const [comprovante, setComprovante] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    // Verificar autenticação
    const motoristaData = localStorage.getItem('motorista');
    if (!motoristaData) {
      router.push('/login-motorista');
      return;
    }

    const motoristaObj = JSON.parse(motoristaData);
    setMotorista(motoristaObj);
    fetchEntrega();
  }, []);

  const fetchEntrega = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/entregas/${params.id}`);
      const data = await response.json();
      setEntrega(data);
    } catch (error) {
      console.error('Erro ao buscar entrega:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (novoStatus) => {
    try {
      const response = await fetch(`/api/entregas/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (response.ok) {
        alert(`Status atualizado para ${novoStatus}!`);
        fetchEntrega();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setComprovante(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const enviarComprovante = async () => {
    if (!comprovante) {
      alert('Selecione uma foto do comprovante');
      return;
    }

    try {
      // Em produção, você faria upload real da imagem
      // Por agora, vamos apenas salvar o nome do arquivo
      const nomeArquivo = `comprovante_${params.id}_${Date.now()}.jpg`;

      const response = await fetch(`/api/entregas/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comprovante: nomeArquivo,
          status: 'ENTREGUE'
        })
      });

      if (response.ok) {
        alert('Comprovante enviado com sucesso!');
        setShowProvaModal(false);
        fetchEntrega();
        router.push('/minhas-entregas');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao enviar comprovante');
      }
    } catch (error) {
      console.error('Erro ao enviar comprovante:', error);
      alert('Erro ao enviar comprovante');
    }
  };

  const getMapUrl = () => {
    if (!entrega?.pedido?.endereco_cliente) return '';
    const endereco = encodeURIComponent(entrega.pedido.endereco_cliente);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${endereco}`;
  };

  const getDirectionsUrl = () => {
    if (!entrega?.pedido?.endereco_cliente) return '#';
    const endereco = encodeURIComponent(entrega.pedido.endereco_cliente);
    return `https://www.google.com/maps/dir/?api=1&destination=${endereco}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <HeaderMotorista />
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  if (!entrega) {
    return (
      <div className={styles.container}>
        <HeaderMotorista />
        <div className={styles.error}>Entrega não encontrada</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HeaderMotorista />

      <div className={styles.content}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.btnBack}>
            ← Voltar
          </button>
          <h1>Entrega #{entrega.id}</h1>
          <span className={`${styles.statusBadge} ${styles['status' + entrega.status]}`}>
            {entrega.status.replace('_', ' ')}
          </span>
        </div>

        <div className={styles.grid}>
          {/* Informações do Cliente */}
          <div className={styles.card}>
            <h2>👤 Informações do Cliente</h2>
            <div className={styles.infoGroup}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Nome:</span>
                <span className={styles.value}>{entrega.pedido?.cliente?.nome}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Telefone:</span>
                <a href={`tel:${entrega.pedido?.cliente?.telefone}`} className={styles.phone}>
                  📞 {entrega.pedido?.cliente?.telefone}
                </a>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{entrega.pedido?.cliente?.email}</span>
              </div>
            </div>
          </div>

          {/* Informações do Pedido */}
          <div className={styles.card}>
            <h2>📦 Informações do Pedido</h2>
            <div className={styles.infoGroup}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Número:</span>
                <span className={styles.value}>{entrega.pedido?.numero_pedido}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Valor Total:</span>
                <span className={styles.valueHighlight}>R$ {entrega.pedido?.valor_total}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Status Pedido:</span>
                <span className={styles.value}>{entrega.pedido?.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Endereço de Entrega */}
        <div className={styles.card}>
          <h2>📍 Endereço de Entrega</h2>
          <div className={styles.address}>
            <p>{entrega.pedido?.endereco_cliente}</p>
            <a 
              href={getDirectionsUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.btnMapa}
            >
              🗺️ Abrir no Google Maps
            </a>
          </div>
        </div>

        {/* Mapa Simulado */}
        <div className={styles.card}>
          <h2>🗺️ Localização no Mapa</h2>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapIcon}>📍</div>
            <p>{entrega.pedido?.endereco_cliente}</p>
            <a 
              href={getDirectionsUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.btnNavegar}
            >
              Iniciar Navegação GPS
            </a>
          </div>
        </div>

        {/* Informações da Entrega */}
        <div className={styles.card}>
          <h2>🚚 Informações da Entrega</h2>
          <div className={styles.infoGroup}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Veículo:</span>
              <span className={styles.value}>
                {entrega.veiculo?.placa} - {entrega.veiculo?.marca} {entrega.veiculo?.modelo}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Atribuído em:</span>
              <span className={styles.value}>
                {new Date(entrega.atribuido_em).toLocaleString('pt-BR')}
              </span>
            </div>
            {entrega.entregue_em && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Entregue em:</span>
                <span className={styles.value}>
                  {new Date(entrega.entregue_em).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
            {entrega.comprovante && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Comprovante:</span>
                <span className={styles.value}>{entrega.comprovante}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ações de Status */}
        <div className={styles.actions}>
          <h2>Atualizar Status da Entrega</h2>
          <div className={styles.actionButtons}>
            {entrega.status === 'PENDENTE' && (
              <button
                onClick={() => atualizarStatus('EM_ROTA')}
                className={`${styles.btnAction} ${styles.btnEmRota}`}
              >
                🚚 Iniciar Rota
              </button>
            )}

            {entrega.status === 'EM_ROTA' && (
              <>
                <button
                  onClick={() => setShowProvaModal(true)}
                  className={`${styles.btnAction} ${styles.btnEntregue}`}
                >
                  ✅ Marcar como Entregue
                </button>
                <button
                  onClick={() => atualizarStatus('PENDENTE')}
                  className={`${styles.btnAction} ${styles.btnVoltar}`}
                >
                  ⏮️ Voltar para Pendente
                </button>
              </>
            )}

            {entrega.status === 'ENTREGUE' && (
              <div className={styles.entregueInfo}>
                <div className={styles.successIcon}>✅</div>
                <h3>Entrega Concluída!</h3>
                <p>Esta entrega foi concluída com sucesso</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Prova de Entrega */}
      {showProvaModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProvaModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowProvaModal(false)}>×</button>
            <h2>📸 Prova de Entrega</h2>
            <p className={styles.modalSubtitle}>
              Tire ou anexe uma foto do comprovante de entrega
            </p>

            <div className={styles.uploadArea}>
              {previewUrl ? (
                <div className={styles.preview}>
                  <img src={previewUrl} alt="Preview" />
                  <button 
                    onClick={() => {
                      setComprovante(null);
                      setPreviewUrl('');
                    }}
                    className={styles.btnRemover}
                  >
                    🗑️ Remover
                  </button>
                </div>
              ) : (
                <label className={styles.uploadLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <div className={styles.uploadIcon}>📷</div>
                  <p>Clique para tirar foto ou selecionar arquivo</p>
                </label>
              )}
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowProvaModal(false)} className={styles.btnSecondary}>
                Cancelar
              </button>
              <button onClick={enviarComprovante} className={styles.btnPrimary} disabled={!comprovante}>
                Enviar e Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
