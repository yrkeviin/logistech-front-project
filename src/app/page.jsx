'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function LoginPage() {
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('ADMIN');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const values = { email, senha };

    try {
      if (tipoUsuario === 'MOTORISTA') {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.erro || 'Erro no login');
        }

        if (data.usuario.funcao !== 'MOTORISTA') {
          throw new Error('Este usuário não é um motorista');
        }

        localStorage.setItem('motorista', JSON.stringify({
          id: data.usuario.id,
          nome: data.usuario.nome,
          email: data.usuario.email,
          funcao: data.usuario.funcao
        }));

        router.push('/minhas-entregas');
      } else {
        const { data } = await axios.post('/api/login', values);
        
        if (data.usuario.funcao !== 'ADMIN') {
          throw new Error('Este usuário não é um administrador');
        }
        
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        router.replace('/home');
      }
    } catch (err) {
      setErro(err.response?.data?.erro || err.message || 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoContainer}>
            <img src="/image/logoPrin.png" alt="LogisTech Logo" />

            <h1 className={styles.loginTitle}>LOGISTECH</h1>
          </div>
          <p className={styles.loginSubtitle}>Sistema de Entregas</p>
        </div>

        {erro && (
          <div className={styles.errorAlert}>
            <strong>Erro:</strong> {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formItem}>
            <div className={styles.userTypeGroup}>
              <button
                type="button"
                className={`${styles.userTypeButton} ${tipoUsuario === 'ADMIN' ? styles.selected : ''}`}
                onClick={() => setTipoUsuario('ADMIN')}
              >
                Admin
              </button>
              <button
                type="button"
                className={`${styles.userTypeButton} ${tipoUsuario === 'MOTORISTA' ? styles.selected : ''}`}
                onClick={() => setTipoUsuario('MOTORISTA')}
              >
                Motorista
              </button>
            </div>
          </div>

          <div className={styles.formItem}>
            <input
              type="email"
              placeholder="Email@logistech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formItem}>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className={styles.formItem}>
            <button
              type="submit"
              disabled={carregando}
              className={`${styles.submitButton} ${tipoUsuario === 'MOTORISTA' ? styles.submitButtonMotorista : styles.submitButtonAdmin}`}
            >
              {carregando ? 'Entrando...' : (tipoUsuario === 'MOTORISTA' ? 'Entrar como Motorista' : 'Entrar como Admin')}
            </button>
          </div>

          <div className={styles.cadastroLink}>
            Não tem uma conta?{' '}
            <a href="/cadastro" onClick={(e) => {
              e.preventDefault();
              router.push('/cadastro');
            }}>
              Cadastre-se
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}