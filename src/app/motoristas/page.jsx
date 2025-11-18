'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import HeaderAdm from '../../components/HeaderAdm/HeaderAdm';

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMotorista, setSelectedMotorista] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    funcao: 'MOTORISTA'
  });

  useEffect(() => {
    fetchMotoristas();
  }, []);

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
      funcao: 'MOTORISTA'
    });
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
      const data = await response.json();
      setSelectedMotorista(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
    }
  };

  const handleDelete = async (id, motorista) => {
    // Verificar se motorista tem entregas ou veículos
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
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Motorista criado com sucesso!');
        setShowCreateModal(false);
        fetchMotoristas();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar motorista');
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

      {/* Modal Criar */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
            <h2>Novo Motorista</h2>
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

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)} className={styles.btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualizar */}
      {showViewModal && selectedMotorista && (
        <div className={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>×</button>
            <h2>Detalhes do Motorista</h2>

            <div className={styles.viewSection}>
              <h3>Informações Pessoais</h3>
              <p><strong>ID:</strong> #{selectedMotorista.id}</p>
              <p><strong>Nome:</strong> {selectedMotorista.nome}</p>
              <p><strong>Email:</strong> {selectedMotorista.email}</p>
              <p><strong>Telefone:</strong> {selectedMotorista.telefone}</p>
            </div>

            {selectedMotorista.veiculos && selectedMotorista.veiculos.length > 0 && (
              <div className={styles.viewSection}>
                <h3>Veículos ({selectedMotorista.veiculos.length})</h3>
                {selectedMotorista.veiculos.map(veiculo => (
                  <div key={veiculo.id} className={styles.itemCard}>
                    <p><strong>Placa:</strong> {veiculo.placa}</p>
                    <p><strong>Modelo:</strong> {veiculo.marca} {veiculo.modelo}</p>
                    <p><strong>Ano:</strong> {veiculo.ano}</p>
                  </div>
                ))}
              </div>
            )}

            {selectedMotorista.entregas && selectedMotorista.entregas.length > 0 && (
              <div className={styles.viewSection}>
                <h3>Entregas Recentes ({selectedMotorista.entregas.slice(0, 5).length})</h3>
                {selectedMotorista.entregas.slice(0, 5).map(entrega => (
                  <div key={entrega.id} className={styles.itemCard}>
                    <p><strong>Entrega #</strong>{entrega.id}</p>
                    <p><strong>Status:</strong> <span className={`${styles.statusBadge} ${styles['status' + entrega.status]}`}>{entrega.status}</span></p>
                    <p><strong>Atribuído em:</strong> {new Date(entrega.atribuido_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            )}

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
