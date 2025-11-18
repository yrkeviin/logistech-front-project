'use client';

import { useState, useEffect } from 'react';
import HeaderAdm from '../../components/HeaderAdm/HeaderAdm';
import styles from './page.module.css';

export default function UserPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    funcao: 'MOTORISTA'
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setUsuariosFiltrados(usuarios);
    } else {
      const filtered = usuarios.filter(usuario =>
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.telefone.includes(searchTerm) ||
        usuario.funcao.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsuariosFiltrados(filtered);
    }
  }, [searchTerm, usuarios]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/usuarios');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      
      const data = await response.json();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, usuario) => {
    const hasRelations = usuario._count.veiculos > 0 || usuario._count.pedidos_cliente > 0 || usuario._count.entregas > 0;
    
    let confirmMessage = 'Tem certeza que deseja deletar este usuário?';
    if (hasRelations) {
      confirmMessage = `ATENÇÃO: Este usuário possui:\n- ${usuario._count.veiculos} veículos\n- ${usuario._count.pedidos_cliente} pedidos\n- ${usuario._count.entregas} entregas\n\nNão será possível deletar. Deseja visualizar os detalhes?`;
      
      if (confirm(confirmMessage)) {
        handleView(id);
      }
      return;
    }

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || 'Erro ao deletar usuário');
        return;
      }

      setUsuarios(usuarios.filter(u => u.id !== id));
      alert(data.mensagem || 'Usuário deletado com sucesso!');
    } catch (err) {
      alert('Erro ao deletar usuário: ' + err.message);
      console.error('Erro ao deletar usuário:', err);
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

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      senha: '',
      funcao: usuario.funcao
    });
    setShowEditModal(true);
  };

  const handleView = async (id) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        alert('Erro ao buscar detalhes do usuário');
        return;
      }
      
      setSelectedUser(data);
      setShowViewModal(true);
    } catch (err) {
      alert('Erro ao buscar detalhes: ' + err.message);
      console.error('Erro:', err);
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

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || 'Erro ao criar usuário');
        return;
      }

      setShowCreateModal(false);
      fetchUsuarios();
      alert('Usuário criado com sucesso!');
    } catch (err) {
      alert('Erro ao criar usuário: ' + err.message);
      console.error('Erro:', err);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = { ...formData };
      if (!updateData.senha) {
        delete updateData.senha;
      }

      const response = await fetch(`/api/usuarios/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || 'Erro ao atualizar usuário');
        return;
      }

      setShowEditModal(false);
      fetchUsuarios();
      alert('Usuário atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar usuário: ' + err.message);
      console.error('Erro:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (nome) => {
    const names = nome.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return nome.substring(0, 2);
  };

  return (
    <div className={styles.container}>
      <HeaderAdm />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gestão de Motoristas</h1>
        </div>

        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Buscar por nome, email, telefone ou função..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.btnAdd} onClick={handleCreate}>
            + Novo Usuário
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <p>❌ {error}</p>
            <button onClick={fetchUsuarios}>Tentar Novamente</button>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>
            <p>Carregando usuários...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className={styles.empty}>
            <p>
              {searchTerm 
                ? '🔍 Nenhum usuário encontrado com os critérios de busca.' 
                : '📭 Nenhum usuário cadastrado ainda.'}
            </p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Função</th>
                  <th>Veículos</th>
                  <th>Pedidos</th>
                  <th>Entregas</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>#{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefone}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${
                        usuario.funcao === 'ADMIN' ? styles.roleAdmin : styles.roleMotorista
                      }`}>
                        {usuario.funcao}
                      </span>
                    </td>
                    <td>{usuario._count.veiculos}</td>
                    <td>{usuario._count.pedidos_cliente}</td>
                    <td>{usuario._count.entregas}</td>
                    <td>
                      <button 
                        className={styles.btnView}
                        onClick={() => handleView(usuario.id)}
                      >
                        Ver
                      </button>
                      {' '}
                      <button 
                        className={styles.btnEdit}
                        onClick={() => handleEdit(usuario)}
                      >
                        Editar
                      </button>
                      {' '}
                      <button 
                        className={styles.btnDelete}
                        onClick={() => handleDelete(usuario.id, usuario)}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Criar Usuário */}
        {showCreateModal && (
          <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>×</button>
              <h2>Criar Novo Usuário</h2>
              
              <form onSubmit={handleSubmitCreate}>
                <div className={styles.formGroup}>
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="usuario@logistech.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Senha *</label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Função *</label>
                  <select
                    value={formData.funcao}
                    onChange={(e) => setFormData({...formData, funcao: e.target.value})}
                  >
                    <option value="MOTORISTA">Motorista</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setShowCreateModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.btnPrimary}>
                    Criar Usuário
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Usuário */}
        {showEditModal && selectedUser && (
          <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>×</button>
              <h2>Editar Usuário #{selectedUser.id}</h2>
              
              <form onSubmit={handleSubmitEdit}>
                <div className={styles.formGroup}>
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="usuario@logistech.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nova Senha (deixe em branco para manter)</label>
                  <input
                    type="password"
                    minLength="6"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Função</label>
                  <select
                    value={formData.funcao}
                    onChange={(e) => setFormData({...formData, funcao: e.target.value})}
                  >
                    <option value="MOTORISTA">Motorista</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setShowEditModal(false)}>
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

        {/* Modal Ver Detalhes */}
        {showViewModal && selectedUser && (
          <div className={styles.modalOverlay} onClick={() => setShowViewModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setShowViewModal(false)}>×</button>
              <h2>Detalhes do Usuário #{selectedUser.id}</h2>
              
              <div className={styles.viewSection}>
                <h3>Informações Pessoais</h3>
                <p><strong>Nome:</strong> {selectedUser.nome}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Telefone:</strong> {selectedUser.telefone}</p>
                <p><strong>Função:</strong> <span className={`${styles.roleBadge} ${
                  selectedUser.funcao === 'ADMIN' ? styles.roleAdmin : styles.roleMotorista
                }`}>
                  {selectedUser.funcao}
                </span></p>
                <p><strong>Criado em:</strong> {formatDate(selectedUser.criado_em)}</p>
              </div>

              {selectedUser.veiculos && selectedUser.veiculos.length > 0 && (
                <div className={styles.viewSection}>
                  <h3>Veículos ({selectedUser.veiculos.length})</h3>
                  <ul>
                    {selectedUser.veiculos.map((veiculo) => (
                      <li key={veiculo.id}>
                        {veiculo.placa} - {veiculo.marca} {veiculo.modelo} ({veiculo.ano})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedUser.pedidos_cliente && selectedUser.pedidos_cliente.length > 0 && (
                <div className={styles.viewSection}>
                  <h3>Pedidos Recentes ({selectedUser.pedidos_cliente.length})</h3>
                  <ul>
                    {selectedUser.pedidos_cliente.slice(0, 5).map((pedido) => (
                      <li key={pedido.id}>
                        {pedido.numero_pedido} - R$ {pedido.valor_total} - Status: {pedido.status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedUser.entregas && selectedUser.entregas.length > 0 && (
                <div className={styles.viewSection}>
                  <h3>Entregas Recentes ({selectedUser.entregas.length})</h3>
                  <ul>
                    {selectedUser.entregas.slice(0, 5).map((entrega) => (
                      <li key={entrega.id}>
                        Pedido {entrega.pedido.numero_pedido} - {entrega.veiculo.placa} - Status: {entrega.status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.modalActions}>
                <button className={styles.btnSecondary} onClick={() => setShowViewModal(false)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
