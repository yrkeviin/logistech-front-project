'use client';

import { Form, Input, Button, Alert, Radio } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function LoginPage() {
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('ADMIN');
  const router = useRouter();

  const onFinish = async (values) => {
    setErro(null);
    setCarregando(true);

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
          <Alert
            message="Erro"
            description={erro}
            type="error"
            className={styles.errorAlert}
          />
        )}

        <Form onFinish={onFinish} layout="vertical" initialValues={{ tipoUsuario: 'ADMIN' }}>
          <Form.Item
            name="tipoUsuario"
            className={styles.formItem}
          >
            <Radio.Group 
              onChange={(e) => setTipoUsuario(e.target.value)} 
              value={tipoUsuario}
              buttonStyle="solid"
              className={styles.userTypeGroup}
            >
              <Radio.Button 
                value="ADMIN" 
                className={styles.userTypeButton}
              >
                👔 Admin
              </Radio.Button>
              <Radio.Button 
                value="MOTORISTA" 
                className={styles.userTypeButton}
              >
                🚚 Motorista
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            className={styles.formItem}
            name="email"
            rules={[
              { required: true, message: 'Digite seu email!' },
              { type: 'email', message: 'Digite um email válido!' }
            ]}>
            <input type="text" placeholder='Email@logistech.com' />
          </Form.Item>

          <Form.Item
          className={styles.formItem}
            name="senha"
            rules={[{ required: true, message: 'Digite sua senha!' }]}>
            <input type="password" placeholder='Senha'
          />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={carregando}
              className={`${styles.submitButton} ${tipoUsuario === 'MOTORISTA' ? styles.submitButtonMotorista : styles.submitButtonAdmin}`}
            >
              {tipoUsuario === 'MOTORISTA' ? '🚚 Entrar como Motorista' : '👔 Entrar como Admin'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}