'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import HeaderAdm from '../../components/HeaderAdm/HeaderAdm';

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroMotorista, setFiltroMotorista] = useState('');
  const [busca, setBusca] = useState('');

  // Modais
  const [showAtribuirModal, setShowAtribuirModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntrega, setSelectedEntrega] = useState(null);

  // Dados para formulários
  const [motoristas, setMotoristas] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [formData, setFormData] = useState({
    pedido_id: '',
    motorista_id: '',
    veiculo_id: '',
    status: 'PENDENTE'
  });

  useEffect(() => {
    fetchEntregas();
    fetchMotoristas();
    fetchPedidos();
  }, [filtroStatus, filtroMotorista]);

  const fetchEntregas = async () => {
    try {
      setLoading(true);
      let url = '/api/entregas?';
      if (filtroStatus) url += `status=${filtroStatus}&`;
      if (filtroMotorista) url += `motorista_id=${filtroMotorista}&`;

      const response = await fetch(url);
      const data = await response.json();
      setEntregas(data);
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMotoristas = async () => {
    try {
      const response = await fetch('/api/usuarios?funcao=MOTORISTA');
      const data = await response.json();
      setMotoristas(data);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
    }
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch('/api/pedidos');
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const fetchVeiculosByMotorista = async (motoristaId) => {
    try {
      const response = await fetch(`/api/usuarios/${motoristaId}`);
      const data = await response.json();
      setVeiculos(data.veiculos || []);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const handleAtribuir = () => {
    setFormData({
      pedido_id: '',
      motorista_id: '',
      veiculo_id: '',
      status: 'PENDENTE'
    });
    setVeiculos([]);
    setShowAtribuirModal(true);
  };

  const handleEdit = (entrega) => {
    setSelectedEntrega(entrega);
    setFormData({
      motorista_id: entrega.motorista_id,
      veiculo_id: entrega.veiculo_id,
      status: entrega.status
    });
    fetchVeiculosByMotorista(entrega.motorista_id);
    setShowEditModal(true);
  };

  const handleView = async (id) => {
    try {
      const response = await fetch(`/api/entregas/${id}`);
      const data = await response.json();
      setSelectedEntrega(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const handleDelete = async (id, entrega) => {
    if (confirm(`Deseja realmente deletar a entrega #${entrega.id}?`)) {
      try {
        const response = await fetch(`/api/entregas/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Entrega deletada com sucesso!');
          fetchEntregas();
        } else {
          const error = await response.json();
          alert(error.error || 'Erro ao deletar entrega');
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar entrega');
      }
    }
  };

  const handleSubmitAtribuir = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/entregas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Entrega atribuída com sucesso!');
        setShowAtribuirModal(false);
        fetchEntregas();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atribuir entrega');
      }
    } catch (error) {
      console.error('Erro ao atribuir:', error);
      alert('Erro ao atribuir entrega');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/entregas/${selectedEntrega.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Entrega atualizada com sucesso!');
        setShowEditModal(false);
        fetchEntregas();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar entrega');
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar entrega');
    }
  };

  const handleMotoristaChange = (motoristaId) => {
    setFormData({ ...formData, motorista_id: motoristaId, veiculo_id: '' });
    if (motoristaId) {
      fetchVeiculosByMotorista(motoristaId);
    } else {
      setVeiculos([]);
    }
  };

  const entregasFiltradas = entregas.filter(entrega => {
    const buscaLower = busca.toLowerCase();
    return (
      entrega.motorista?.nome.toLowerCase().includes(buscaLower) ||
      entrega.pedido?.numero_pedido.toLowerCase().includes(buscaLower) ||
      entrega.pedido?.cliente?.nome.toLowerCase().includes(buscaLower) ||
      entrega.veiculo?.placa.toLowerCase().includes(buscaLower)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDENTE': return styles.statusPENDENTE;
      case 'EM_ROTA': return styles.statusEM_ROTA;
      case 'ENTREGUE': return styles.statusENTREGUE;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <HeaderAdm />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Gestão de Entregas</h1>
          <button onClick={handleAtribuir} className={styles.btnPrimary}>
            + Atribuir Entrega
          </button>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por pedido, motorista, cliente ou placa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.searchInput}
          />

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos os Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ROTA">Em Rota</option>
            <option value="ENTREGUE">Entregue</option>
          </select>

          <select
            value={filtroMotorista}
            onChange={(e) => setFiltroMotorista(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos os Motoristas</option>
            {motoristas.map(m => (
              <option key={m.id} value={m.id}>{m.nome}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Motorista</th>
                  <th>Veículo</th>
                  <th>Status</th>
                  <th>Atribuído em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {entregasFiltradas.map(entrega => (
                  <tr key={entrega.id}>
                    <td>#{entrega.id}</td>
                    <td>{entrega.pedido?.numero_pedido}</td>
                    <td>{entrega.pedido?.cliente?.nome}</td>
                    <td>{entrega.motorista?.nome}</td>
                    <td>{entrega.veiculo?.placa} - {entrega.veiculo?.modelo}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(entrega.status)}`}>
                        {entrega.status}
                      </span>
                    </td>
                    <td>{new Date(entrega.atribuido_em).toLocaleDateString('pt-BR')}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleView(entrega.id)} className={styles.btnView}>
                        Ver
                      </button>
                      <button onClick={() => handleEdit(entrega)} className={styles.btnEdit}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(entrega.id, entrega)} className={styles.btnDelete}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {entregasFiltradas.length === 0 && (
              <div className={styles.noData}>Nenhuma entrega encontrada</div>
            )}
          </div>
        )}
      </div>

      {/* Modal Atribuir Entrega */}
      {showAtribuirModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAtribuirModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowAtribuirModal(false)}>×</button>
            <h2>Atribuir Entrega</h2>
            <form onSubmit={handleSubmitAtribuir}>
              <div className={styles.formGroup}>
                <label>Pedido *</label>
                <select
                  value={formData.pedido_id}
                  onChange={(e) => setFormData({...formData, pedido_id: parseInt(e.target.value)})}
                  required
                >
                  <option value="">Selecione um pedido</option>
                  {pedidos.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.numero_pedido} - {p.cliente?.nome} - R$ {p.valor_total}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Motorista *</label>
                <select
                  value={formData.motorista_id}
                  onChange={(e) => handleMotoristaChange(parseInt(e.target.value))}
                  required
                >
                  <option value="">Selecione um motorista</option>
                  {motoristas.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Veículo *</label>
                <select
                  value={formData.veiculo_id}
                  onChange={(e) => setFormData({...formData, veiculo_id: parseInt(e.target.value)})}
                  required
                  disabled={!formData.motorista_id}
                >
                  <option value="">Selecione um veículo</option>
                  {veiculos.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.placa} - {v.marca} {v.modelo}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ROTA">Em Rota</option>
                  <option value="ENTREGUE">Entregue</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAtribuirModal(false)} className={styles.btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Atribuir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && selectedEntrega && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>×</button>
            <h2>Editar Entrega #{selectedEntrega.id}</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className={styles.formGroup}>
                <label>Motorista *</label>
                <select
                  value={formData.motorista_id}
                  onChange={(e) => handleMotoristaChange(parseInt(e.target.value))}
                  required
                >
                  <option value="">Selecione um motorista</option>
                  {motoristas.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Veículo *</label>
                <select
                  value={formData.veiculo_id}
                  onChange={(e) => setFormData({...formData, veiculo_id: parseInt(e.target.value)})}
                  required
                >
                  <option value="">Selecione um veículo</option>
                  {veiculos.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.placa} - {v.marca} {v.modelo}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ROTA">Em Rota</option>
                  <option value="ENTREGUE">Entregue</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowEditModal(false)} className={styles.btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualizar */}
      {showViewModal && selectedEntrega && (
        <div className={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>×</button>
            <h2>Detalhes da Entrega #{selectedEntrega.id}</h2>

            <div className={styles.viewSection}>
              <h3>Informações do Pedido</h3>
              <p><strong>Número do Pedido:</strong> {selectedEntrega.pedido?.numero_pedido}</p>
              <p><strong>Valor Total:</strong> R$ {selectedEntrega.pedido?.valor_total}</p>
              <p><strong>Endereço:</strong> {selectedEntrega.pedido?.endereco_cliente}</p>
              <p><strong>Status do Pedido:</strong> {selectedEntrega.pedido?.status}</p>
            </div>

            <div className={styles.viewSection}>
              <h3>Cliente</h3>
              <p><strong>Nome:</strong> {selectedEntrega.pedido?.cliente?.nome}</p>
              <p><strong>Email:</strong> {selectedEntrega.pedido?.cliente?.email}</p>
              <p><strong>Telefone:</strong> {selectedEntrega.pedido?.cliente?.telefone}</p>
            </div>

            <div className={styles.viewSection}>
              <h3>Motorista</h3>
              <p><strong>Nome:</strong> {selectedEntrega.motorista?.nome}</p>
              <p><strong>Email:</strong> {selectedEntrega.motorista?.email}</p>
              <p><strong>Telefone:</strong> {selectedEntrega.motorista?.telefone}</p>
            </div>

            <div className={styles.viewSection}>
              <h3>Veículo</h3>
              <p><strong>Placa:</strong> {selectedEntrega.veiculo?.placa}</p>
              <p><strong>Modelo:</strong> {selectedEntrega.veiculo?.marca} {selectedEntrega.veiculo?.modelo}</p>
              <p><strong>Ano:</strong> {selectedEntrega.veiculo?.ano}</p>
            </div>

            <div className={styles.viewSection}>
              <h3>Status da Entrega</h3>
              <p>
                <span className={`${styles.statusBadge} ${getStatusClass(selectedEntrega.status)}`}>
                  {selectedEntrega.status}
                </span>
              </p>
              <p><strong>Atribuído em:</strong> {new Date(selectedEntrega.atribuido_em).toLocaleString('pt-BR')}</p>
              {selectedEntrega.entregue_em && (
                <p><strong>Entregue em:</strong> {new Date(selectedEntrega.entregue_em).toLocaleString('pt-BR')}</p>
              )}
              {selectedEntrega.comprovante && (
                <p><strong>Comprovante:</strong> {selectedEntrega.comprovante}</p>
              )}
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowViewModal(false)} className={styles.btnSecondary}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
