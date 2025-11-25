'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import HeaderAdm from '../../components/HeaderAdm/HeaderAdm';
import ViewModal from '../../components/ViewModal/ViewModal';

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroMotorista, setFiltroMotorista] = useState('');
  const [busca, setBusca] = useState('');

  const [showAtribuirModal, setShowAtribuirModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntrega, setSelectedEntrega] = useState(null);

  const [motoristas, setMotoristas] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [formData, setFormData] = useState({
    pedido_id: '',
    motorista_id: '',
    veiculo_id: '',
    status: 'PENDENTE'
  });
  const [pedidoAtribuidoId, setPedidoAtribuidoId] = useState(null);

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
      
      
      if (Array.isArray(data)) {
        setEntregas(data);
      } else {
        console.error('Resposta da API não é um array:', data);
        setEntregas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
      setEntregas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMotoristas = async () => {
    try {
      const response = await fetch('/api/usuarios?funcao=MOTORISTA');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setMotoristas(data);
      } else {
        console.error('Motoristas não é um array:', data);
        setMotoristas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      setMotoristas([]);
    }
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch('/api/pedidos');
      const data = await response.json();
      
      if (Array.isArray(data)) {
  setPedidos(data);
      } else {
        console.error('Pedidos não é um array:', data);
        setPedidos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setPedidos([]);
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
    setPedidoAtribuidoId(null);
    setShowAtribuirModal(true);
  };

  const handleEdit = async (entrega) => {
    setSelectedEntrega(entrega);
    setFormData({
      motorista_id: entrega.motorista_id,
      veiculo_texto: entrega.veiculo ? `${entrega.veiculo.placa} - ${entrega.veiculo.marca} ${entrega.veiculo.modelo}` : '',
      status: entrega.status,
      comprovante: entrega.comprovante || ''
    });
    
    setShowEditModal(true);
  };

  const handleView = async (id) => {
    try {
  const entregaLocal = entregas.find(e => e.id === id);

      if (entregaLocal && entregaLocal.pedido && entregaLocal.motorista && entregaLocal.veiculo) {
        setSelectedEntrega(entregaLocal);
        setShowViewModal(true);
        return;
      }

  const response = await fetch(`/api/entregas/${id}`);
      const data = await response.json();

      if (response.ok && data) {
        setSelectedEntrega(data);
        setShowViewModal(true);
      } else {
        console.error('Erro na resposta ao buscar entrega:', data);
        alert('Erro ao carregar detalhes da entrega');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      alert('Erro ao buscar detalhes da entrega');
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
      if (pedidoAtribuidoId) {
        const payload = {
          motorista_id: parseInt(formData.motorista_id),
          veiculo_id: parseInt(formData.veiculo_id),
          status: formData.status
        };

        const response = await fetch(`/api/entregas/${pedidoAtribuidoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert('Entrega reatribuída com sucesso!');
          setShowAtribuirModal(false);
          fetchEntregas();
        } else {
          const error = await response.json();
          alert(error.error || 'Erro ao reatribuir entrega');
        }
      } else {
        const payload = {
          pedido_id: parseInt(formData.pedido_id),
          motorista_id: parseInt(formData.motorista_id),
          veiculo_id: parseInt(formData.veiculo_id),
          status: formData.status
        };

        const response = await fetch('/api/entregas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert('Entrega atribuída com sucesso!');
          setShowAtribuirModal(false);
          fetchEntregas();
        } else {
          const error = await response.json();
          alert(error.error || 'Erro ao atribuir entrega');
        }
      }
    } catch (error) {
      console.error('Erro ao atribuir:', error);
      alert('Erro ao atribuir entrega');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      console.log('Atualizando entrega:', selectedEntrega.id, 'com dados:', formData);
      
      const updateData = {
        motorista_id: parseInt(formData.motorista_id),
        status: formData.status
      };
      
      if (formData.comprovante) {
        updateData.comprovante = formData.comprovante;
      }
      
      const response = await fetch(`/api/entregas/${selectedEntrega.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Entrega atualizada:', result);
        alert('Entrega atualizada com sucesso!');
        setShowEditModal(false);
        fetchEntregas();
      } else {
        const error = await response.json();
        console.error('Erro da API:', error);
        alert(error.error || 'Erro ao atualizar entrega');
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar entrega: ' + error.message);
    }
  };

  const handleMotoristaChange = async (motoristaId) => {
    setFormData({ ...formData, motorista_id: motoristaId, veiculo_id: '' });
    setVeiculos([]);
    if (motoristaId) {
      await fetchVeiculosByMotorista(motoristaId);
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
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : '';
                    setFormData({...formData, pedido_id: val});
                    const p = pedidos.find(x => x.id === val);
                    if (p && p.entregas && p.entregas.length > 0) {
                      setPedidoAtribuidoId(p.entregas[0].id);
                    } else {
                      setPedidoAtribuidoId(null);
                    }
                  }}
                  required
                >
                  <option value="">Selecione um pedido</option>
                  {pedidos.map(p => {
                    const jáAtribuido = p.entregas && p.entregas.length > 0;
                    return (
                      <option key={p.id} value={p.id} disabled={jáAtribuido}>
                        {p.numero_pedido} - {p.cliente?.nome} - R$ {p.valor_total}{jáAtribuido ? ' — Já atribuído' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {pedidoAtribuidoId && (
                <div className={styles.formGroup} style={{background: '#fff6f0', padding: '8px', borderRadius: 6, marginBottom: 12}}>
                  <strong>Atenção:</strong> Este pedido já possui uma entrega atribuída (ID: {pedidoAtribuidoId}). Ao confirmar, a entrega existente será reatribuída para o motorista/veículo selecionado.
                </div>
              )}

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
                  {pedidoAtribuidoId ? 'Reatribuir entrega' : 'Atribuir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showEditModal && selectedEntrega && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>×</button>
            <h2>Editar Entrega #{selectedEntrega.id}</h2>
            
            <div className={styles.viewSection} style={{marginBottom: '1.5rem', padding: '10px', background: '#f5f5f5', borderRadius: '5px'}}>
              <p><strong>Pedido:</strong> {selectedEntrega.pedido?.numero_pedido}</p>
            </div>

            <form onSubmit={handleSubmitEdit}>
              <div className={styles.formGroup}>
                <label>Motorista *</label>
                <select
                  value={formData.motorista_id}
                  onChange={(e) => setFormData({...formData, motorista_id: parseInt(e.target.value)})}
                  required
                >
                  <option value="">Selecione um motorista</option>
                  {motoristas.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Veículo</label>
                <input
                  type="text"
                  value={formData.veiculo_texto}
                  onChange={(e) => setFormData({...formData, veiculo_texto: e.target.value})}
                  placeholder="Digite a placa ou informações do veículo (opcional)"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Comprovante</label>
                <input
                  type="text"
                  value={formData.comprovante}
                  onChange={(e) => setFormData({...formData, comprovante: e.target.value})}
                  placeholder="Digite o número/nome do comprovante (opcional)"
                />
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

      
      {showViewModal && selectedEntrega && (
        <ViewModal title={`Detalhes da Entrega #${selectedEntrega.id || 'N/A'}`} onClose={() => setShowViewModal(false)}>
          <div className={styles.viewSection}>
            <h3>Informações do Pedido</h3>
            <p><strong>Número do Pedido:</strong> {selectedEntrega.pedido?.numero_pedido || 'N/A'}</p>
            <p><strong>Valor Total:</strong> R$ {selectedEntrega.pedido?.valor_total ? Number(selectedEntrega.pedido.valor_total).toFixed(2) : '0.00'}</p>
            <p><strong>Endereço:</strong> {selectedEntrega.pedido?.endereco_cliente || 'N/A'}</p>
            <p><strong>Status do Pedido:</strong> {selectedEntrega.pedido?.status || 'N/A'}</p>
          </div>

          <div className={styles.viewSection}>
            <h3>Cliente</h3>
            <p><strong>Nome:</strong> {selectedEntrega.pedido?.cliente?.nome || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedEntrega.pedido?.cliente?.email || 'N/A'}</p>
            <p><strong>Telefone:</strong> {selectedEntrega.pedido?.cliente?.telefone || 'N/A'}</p>
          </div>

          <div className={styles.viewSection}>
            <h3>Motorista</h3>
            <p><strong>Nome:</strong> {selectedEntrega.motorista?.nome || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedEntrega.motorista?.email || 'N/A'}</p>
            <p><strong>Telefone:</strong> {selectedEntrega.motorista?.telefone || 'N/A'}</p>
          </div>

          <div className={styles.viewSection}>
            <h3>Veículo</h3>
            <p><strong>Placa:</strong> {selectedEntrega.veiculo?.placa || 'N/A'}</p>
            <p><strong>Modelo:</strong> {selectedEntrega.veiculo?.marca || ''} {selectedEntrega.veiculo?.modelo || 'N/A'}</p>
            <p><strong>Ano:</strong> {selectedEntrega.veiculo?.ano || 'N/A'}</p>
          </div>

          <div className={styles.viewSection}>
            <h3>Status da Entrega</h3>
            <p>
              <span className={`${styles.statusBadge} ${getStatusClass(selectedEntrega.status)}`}>
                {selectedEntrega.status || 'N/A'}
              </span>
            </p>
            <p><strong>Atribuído em:</strong> {selectedEntrega.atribuido_em ? new Date(selectedEntrega.atribuido_em).toLocaleString('pt-BR') : 'N/A'}</p>
            {selectedEntrega.entregue_em && selectedEntrega.status === 'ENTREGUE' && (
              <p><strong>Entregue em:</strong> {new Date(selectedEntrega.entregue_em).toLocaleString('pt-BR')}</p>
            )}
            {selectedEntrega.comprovante && (
              <p><strong>Comprovante:</strong> {selectedEntrega.comprovante}</p>
            )}
          </div>

        </ViewModal>
      )}
    </div>
  );
}
