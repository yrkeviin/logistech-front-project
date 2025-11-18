'use client';

import { Form, Input, Button, Alert, Radio } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

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
        // Login do motorista
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
        // Login do admin
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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#667eea', marginBottom: '10px' }}>🏢 LOGISTECH</h1>
          <p style={{ color: '#718096', margin: 0 }}>Sistema de Entregas</p>
        </div>

        {erro && (
          <Alert
            message="Erro"
            description={erro}
            type="error"
            style={{ marginBottom: '20px' }}
          />
        )}

        <Form onFinish={onFinish} layout="vertical" initialValues={{ tipoUsuario: 'ADMIN' }}>
          <Form.Item
            label="Tipo de Usuário"
            name="tipoUsuario"
            style={{ marginBottom: '20px' }}
          >
            <Radio.Group 
              onChange={(e) => setTipoUsuario(e.target.value)} 
              value={tipoUsuario}
              buttonStyle="solid"
              style={{ width: '100%', display: 'flex' }}
            >
              <Radio.Button 
                value="ADMIN" 
                style={{ 
                  flex: 1, 
                  textAlign: 'center',
                  height: '45px',
                  lineHeight: '45px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                👔 Admin
              </Radio.Button>
              <Radio.Button 
                value="MOTORISTA" 
                style={{ 
                  flex: 1, 
                  textAlign: 'center',
                  height: '45px',
                  lineHeight: '45px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                🚚 Motorista
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Digite seu email!' },
              { type: 'email', message: 'Digite um email válido!' }
            ]}>
            <Input size="large" placeholder="exemplo@logistech.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="senha"
            rules={[{ required: true, message: 'Digite sua senha!' }]}>
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={carregando}
              style={{ 
                background: tipoUsuario === 'MOTORISTA' 
                  ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: '45px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {tipoUsuario === 'MOTORISTA' ? '🚚 Entrar como Motorista' : '👔 Entrar como Admin'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}