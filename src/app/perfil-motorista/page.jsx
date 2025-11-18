'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderMotorista from '../../components/HeaderMotorista/HeaderMotorista';
import styles from './page.module.css';

export default function PerfilMotorista() {
  const router = useRouter();
  const [motorista, setMotorista] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: ''
  });
  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [showSenhaModal, setShowSenhaModal] = useState(false);

  useEffect(() => {
    const motoristaData = localStorage.getItem('motorista');
    if (!motoristaData) {
      router.push('/login-motorista');
      return;
    }

    const motorista = JSON.parse(motoristaData);
    fetchMotorista(motorista.id);
    fetchVeiculos(motorista.id);
  }, []);

  const fetchMotorista = async (id) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`);
      const data = await res.json();
      setMotorista(data);
      setFormData({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email
      });
    } catch (error) {
      console.error('Erro ao carregar motorista:', error);
    }
  };

  const fetchVeiculos = async (motoristaId) => {
    try {
      const res = await fetch(`/api/veiculos?motorista_id=${motoristaId}`);
      const data = await res.json();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    }
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`/api/usuarios/${motorista.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updated = await res.json();
        setMotorista(updated);
        setIsEditing(false);
        
        // Atualizar localStorage
        const motoristaStorage = JSON.parse(localStorage.getItem('motorista'));
        localStorage.setItem('motorista', JSON.stringify({
          ...motoristaStorage,
          nome: updated.nome,
          email: updated.email
        }));
        
        alert('Perfil atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar perfil');
    }
  };

  const handleUpdateSenha = async (e) => {
    e.preventDefault();

    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }

    if (senhaData.novaSenha.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      const res = await fetch(`/api/usuarios/${motorista.id}/senha`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senhaAtual: senhaData.senhaAtual,
          novaSenha: senhaData.novaSenha
        })
      });

      if (res.ok) {
        alert('Senha atualizada com sucesso!');
        setShowSenhaModal(false);
        setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao atualizar senha');
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      alert('Erro ao atualizar senha');
    }
  };

  if (!motorista) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <HeaderMotorista />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1>Meu Perfil</h1>
            <div className={styles.headerButtons}>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className={styles.btnEdit}>
                  ✏️ Editar Perfil
                </button>
              )}
              <button onClick={() => setShowSenhaModal(true)} className={styles.btnPassword}>
                🔒 Alterar Senha
              </button>
            </div>
          </div>

          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {motorista.nome.charAt(0).toUpperCase()}
              </div>
              <div className={styles.profileInfo}>
                <h2>{motorista.nome}</h2>
                <span className={styles.badge}>Motorista</span>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdatePerfil} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formButtons}>
                  <button type="submit" className={styles.btnSave}>Salvar Alterações</button>
                  <button type="button" onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      nome: motorista.nome,
                      telefone: motorista.telefone,
                      email: motorista.email
                    });
                  }} className={styles.btnCancel}>Cancelar</button>
                </div>
              </form>
            ) : (
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>📧 E-mail:</span>
                  <span className={styles.detailValue}>{motorista.email}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>📱 Telefone:</span>
                  <span className={styles.detailValue}>{motorista.telefone}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>👤 Função:</span>
                  <span className={styles.detailValue}>{motorista.funcao}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.vehiclesCard}>
            <h3>🚚 Meus Veículos</h3>
            {veiculos.length > 0 ? (
              <div className={styles.vehiclesList}>
                {veiculos.map(veiculo => (
                  <div key={veiculo.id} className={styles.vehicleItem}>
                    <div className={styles.vehicleIcon}>🚛</div>
                    <div className={styles.vehicleInfo}>
                      <h4>{veiculo.modelo}</h4>
                      <p className={styles.vehiclePlate}>{veiculo.placa}</p>
                      <div className={styles.vehicleSpecs}>
                        <span>Capacidade: {veiculo.capacidade_kg} kg</span>
                        <span className={veiculo.disponivel ? styles.available : styles.unavailable}>
                          {veiculo.disponivel ? '✓ Disponível' : '✗ Indisponível'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noVehicles}>Nenhum veículo cadastrado</p>
            )}
          </div>
        </div>
      </main>

      {showSenhaModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSenhaModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Alterar Senha</h2>
              <button onClick={() => setShowSenhaModal(false)} className={styles.closeBtn}>×</button>
            </div>

            <form onSubmit={handleUpdateSenha} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Senha Atual</label>
                <input
                  type="password"
                  value={senhaData.senhaAtual}
                  onChange={(e) => setSenhaData({ ...senhaData, senhaAtual: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nova Senha</label>
                <input
                  type="password"
                  value={senhaData.novaSenha}
                  onChange={(e) => setSenhaData({ ...senhaData, novaSenha: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={senhaData.confirmarSenha}
                  onChange={(e) => setSenhaData({ ...senhaData, confirmarSenha: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.btnSave}>Alterar Senha</button>
                <button type="button" onClick={() => setShowSenhaModal(false)} className={styles.btnCancel}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
