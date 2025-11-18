'use client';
import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginMotorista() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Verificar se é motorista
        if (data.usuario.funcao !== 'MOTORISTA') {
          setError('Acesso restrito a motoristas. Use o login de administrador.');
          setLoading(false);
          return;
        }

        // Salvar no localStorage
        localStorage.setItem('motorista', JSON.stringify(data.usuario));
        
        // Redirecionar para minhas entregas
        router.push('/minhas-entregas');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <Image src="/image/logoLogis.png" alt="LogisTech" width={180} height={60} />
          <h1>Portal do Motorista</h1>
          <p>Acesse suas entregas e rotas</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="seu.email@logistech.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Senha</label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Entrando...' : '🚚 Entrar'}
          </button>

          <div className={styles.footer}>
            <p>Esqueceu sua senha? Entre em contato com o administrador</p>
          </div>
        </form>
      </div>

      <div className={styles.illustration}>
        <Image 
          src="/image/caminhaoSlogan.png" 
          alt="Caminhão" 
          width={400} 
          height={300}
          style={{ opacity: 0.9 }}
        />
      </div>
    </div>
  );
}
