'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function CadastroPage() {
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('ADMIN');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const router = useRouter();

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleTelefoneChange = (e) => {
    const valorFormatado = formatarTelefone(e.target.value);
    setTelefone(valorFormatado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    // Validações
    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
      setErro('Todos os campos são obrigatórios');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro('Email inválido');
      return;
    }

    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10) {
      setErro('Telefone inválido');
      return;
    }

    setCarregando(true);

    try {
      const response = await axios.post('/api/usuarios', {
        nome,
        email,
        telefone,
        senha,
        funcao: tipoUsuario
      });

      if (response.status === 201) {
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      if (error.response?.data?.erro) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro ao realizar cadastro. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.cadastroCard}>
        <div className={styles.cadastroHeader}>
          <div className={styles.logoContainer}>
            <img src="/image/logoPrin.png" alt="Logo" />
            <h1>LOGISTECH</h1>
          </div>
          <h2 className={styles.cadastroTitle}>Criar Conta</h2>
          <p className={styles.cadastroSubtitle}>
            Preencha os dados para se cadastrar
          </p>
        </div>

        {erro && (
          <div className={styles.errorAlert}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.cadastroForm}>
          <div className={styles.userTypeGroup}>
            <button
              type="button"
              className={`${styles.userTypeButton} ${tipoUsuario === 'ADMIN' ? styles.active : ''}`}
              onClick={() => setTipoUsuario('ADMIN')}
            >
              Admin
            </button>
            <button
              type="button"
              className={`${styles.userTypeButton} ${tipoUsuario === 'MOTORISTA' ? styles.active : ''}`}
              onClick={() => setTipoUsuario('MOTORISTA')}
            >
              Motorista
            </button>
          </div>

          <div className={styles.formItem}>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className={styles.formItem}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className={styles.formItem}>
            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength={15}
              disabled={carregando}
            />
          </div>

          <div className={styles.formItem}>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className={styles.formItem}>
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={carregando}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <div className={styles.loginLink}>
            Já tem uma conta?{' '}
            <a href="/" onClick={(e) => {
              e.preventDefault();
              router.push('/');
            }}>
              Faça login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
