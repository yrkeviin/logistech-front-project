'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import HeaderAdm from '../../components/HeaderAdm/HeaderAdm';
import ViewModal from '../../components/ViewModal/ViewModal';

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMotorista, setSelectedMotorista] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    funcao: 'MOTORISTA',
    veiculo_id: ''
  });

  const [veiculos, setVeiculos] = useState([]);
  const [newVehicleMode, setNewVehicleMode] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ placa: '', modelo: '', marca: '', ano: '' });

  useEffect(() => {
    fetchMotoristas();
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    try {
      const response = await fetch('/api/veiculos');
      const data = await response.json();
  const disponiveis = data.filter(v => !v.motorista);
      setVeiculos(disponiveis);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const fetchMotoristas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/usuarios?funcao=MOTORISTA');
      const data = await response.json();
      setMotoristas(data);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      funcao: 'MOTORISTA',
      veiculo_id: ''
    });
    setNewVehicleMode(false);
    setNewVehicle({ placa: '', modelo: '', marca: '', ano: '' });
    setShowCreateModal(true);
  };

  const handleEdit = (motorista) => {
    setSelectedMotorista(motorista);
    setFormData({
      nome: motorista.nome,
      email: motorista.email,
      telefone: motorista.telefone,
      senha: '',
      funcao: motorista.funcao
    });
    setShowEditModal(true);
  };

  const handleView = async (id) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar motorista');
      }
      
      const data = await response.json();
      setSelectedMotorista(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      alert('Erro ao carregar detalhes do motorista');
    }
  };

  const handleDelete = async (id, motorista) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`);
      const data = await response.json();

      if (data.veiculos?.length > 0 || data.entregas?.length > 0) {
        alert('Não é possível deletar motorista com veículos ou entregas vinculados');
        return;
      }

      if (confirm(`Deseja realmente deletar o motorista ${motorista.nome}?`)) {
        const deleteResponse = await fetch(`/api/usuarios/${id}`, {
          method: 'DELETE'
        });

        if (deleteResponse.ok) {
          alert('Motorista deletado com sucesso!');
          fetchMotoristas();
        } else {
          const error = await deleteResponse.json();
          alert(error.error || 'Erro ao deletar motorista');
        }
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar motorista');
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };
      if (newVehicleMode) {
        delete payload.veiculo_id;
        payload.veiculo = {
          placa: newVehicle.placa,
          modelo: newVehicle.modelo,
          marca: newVehicle.marca,
          ano: newVehicle.ano ? Number(newVehicle.ano) : undefined
        };
      } else {
        payload.veiculo_id = formData.veiculo_id ? Number(formData.veiculo_id) : undefined;
      }

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Motorista criado com sucesso!');
        setShowCreateModal(false);
        fetchMotoristas();
        fetchVeiculos();
      } else {
        const error = await response.json();
        alert(error.erro || error.error || 'Erro ao criar motorista');
      }
    } catch (error) {
      console.error('Erro ao criar:', error);
      alert('Erro ao criar motorista');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.senha) {
        delete dataToUpdate.senha;
      }

      const response = await fetch(`/api/usuarios/${selectedMotorista.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate)
      });

      if (response.ok) {
        alert('Motorista atualizado com sucesso!');
        setShowEditModal(false);
        fetchMotoristas();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar motorista');
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar motorista');
    }
  };

  const motoristasFiltrados = motoristas.filter(motorista => {
    const buscaLower = busca.toLowerCase();
    return (
      motorista.nome.toLowerCase().includes(buscaLower) ||
      motorista.email.toLowerCase().includes(buscaLower) ||
      motorista.telefone.includes(busca)
    );
  });

  return (
    <div className={styles.container}>
      <HeaderAdm />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Gestão de Motoristas</h1>
          <button onClick={handleCreate} className={styles.btnPrimary}>
            + Novo Motorista
          </button>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Veículos</th>
                  <th>Entregas</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {motoristasFiltrados.map(motorista => (
                  <tr key={motorista.id}>
                    <td>#{motorista.id}</td>
                    <td>{motorista.nome}</td>
                    <td>{motorista.email}</td>
                    <td>{motorista.telefone}</td>
                    <td>{motorista._count?.veiculos || 0}</td>
                    <td>{motorista._count?.entregas || 0}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleView(motorista.id)} className={styles.btnView}>
                        Ver
                      </button>
                      <button onClick={() => handleEdit(motorista)} className={styles.btnEdit}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(motorista.id, motorista)} className={styles.btnDelete}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {motoristasFiltrados.length === 0 && (
              <div className={styles.noData}>Nenhum motorista encontrado</div>
            )}
          </div>
        )}
      </div>

      
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
            <h2>Criar Novo Motorista</h2>
            <form onSubmit={handleSubmitCreate}>
              <div className={styles.formGroup}>
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                  placeholder="Nome completo"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone *</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  required
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Senha *</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  required
                  placeholder="Senha de acesso"
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input type="checkbox" checked={newVehicleMode} onChange={(e) => setNewVehicleMode(e.target.checked)} />{' '}
                  Criar veículo novo
                </label>
              </div>

              {newVehicleMode ? (
                <>
                  <div className={styles.formGroup}>
                    <label>Placa *</label>
                    <input type="text" value={newVehicle.placa} onChange={(e) => setNewVehicle({...newVehicle, placa: e.target.value})} required placeholder="ABC1D23" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Marca</label>
                    <input type="text" value={newVehicle.marca} onChange={(e) => setNewVehicle({...newVehicle, marca: e.target.value})} placeholder="Marca" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Modelo</label>
                    <input type="text" value={newVehicle.modelo} onChange={(e) => setNewVehicle({...newVehicle, modelo: e.target.value})} placeholder="Modelo" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Ano</label>
                    <input type="number" value={newVehicle.ano} onChange={(e) => setNewVehicle({...newVehicle, ano: e.target.value})} placeholder="2020" />
                  </div>
                </>
              ) : (
                <div className={styles.formGroup}>
                  <label>Veículo *</label>
                  <select
                    value={formData.veiculo_id}
                    onChange={(e) => setFormData({...formData, veiculo_id: e.target.value})}
                    required
                  >
                    <option value="">Selecione um veículo</option>
                    {veiculos.map(v => (
                      <option key={v.id} value={v.id}>{`${v.placa} - ${v.marca || ''} ${v.modelo || ''} (${v.ano || ''})`}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)} className={styles.btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Criar Motorista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showEditModal && selectedMotorista && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>×</button>
            <h2>Editar Motorista</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className={styles.formGroup}>
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone *</label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nova Senha (deixe em branco para manter)</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  placeholder="Nova senha (opcional)"
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowEditModal(false)} className={styles.btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedMotorista && (
        <React.Suspense fallback={null}>
          <ViewModal title={`Detalhes do Motorista #${selectedMotorista.id || 'N/A'}`} onClose={() => setShowViewModal(false)}>
            <div className={styles.viewSection}>
              <h3>Informações Pessoais</h3>
              <p><strong>Nome:</strong> {selectedMotorista.nome || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedMotorista.email || 'N/A'}</p>
              <p><strong>Telefone:</strong> {selectedMotorista.telefone || 'N/A'}</p>
              <p><strong>Função:</strong> {selectedMotorista.funcao || 'N/A'}</p>
              <p><strong>Criado em:</strong> {selectedMotorista.criado_em ? new Date(selectedMotorista.criado_em).toLocaleDateString('pt-BR') : 'N/A'}</p>
            </div>

            <div className={styles.viewSection}>
              <h3>Estatísticas</h3>
              <p><strong>Total de Veículos:</strong> {selectedMotorista._count?.veiculos || selectedMotorista.veiculos?.length || 0}</p>
              <p><strong>Total de Entregas:</strong> {selectedMotorista._count?.entregas || selectedMotorista.entregas?.length || 0}</p>
              <p><strong>Total de Pedidos:</strong> {selectedMotorista._count?.pedidos_cliente || selectedMotorista.pedidos_cliente?.length || 0}</p>
            </div>

            {selectedMotorista.veiculos && selectedMotorista.veiculos.length > 0 && (
              <div className={styles.viewSection}>
                <h3>Veículos ({selectedMotorista.veiculos.length})</h3>
                <ul>
                  {selectedMotorista.veiculos.map(veiculo => (
                    <li key={veiculo.id}>
                      {veiculo.placa} - {veiculo.marca} {veiculo.modelo} ({veiculo.ano})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedMotorista.entregas && selectedMotorista.entregas.length > 0 && (
              <div className={styles.viewSection}>
                <h3>Entregas Recentes ({selectedMotorista.entregas.slice(0, 5).length})</h3>
                <ul>
                  {selectedMotorista.entregas.slice(0, 5).map(entrega => (
                    <li key={entrega.id}>
                      Entrega #{entrega.id} - Status: {entrega.status} - {new Date(entrega.atribuido_em).toLocaleDateString('pt-BR')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </ViewModal>
          
        </React.Suspense>
      )}
    </div>
  );
}
