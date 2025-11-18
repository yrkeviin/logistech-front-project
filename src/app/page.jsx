'use client';

import { Form, Input, Button, Alert } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setErro(null);
    setCarregando(true);

    try {
      const { data } = await axios.post('/api/login', values);
      sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
      router.replace('/home');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ width: 300 }}>
      <h1>Login</h1>

      {erro && (
        <Alert
          message="Erro"
          description={erro}
          type="error"
        />
      )}

      <Form onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Digite seu email!' },
            { type: 'email', message: 'Digite um email válido!' }
          ]}>
          <Input placeholder="exemplo@logistech.com" />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="senha"
          rules={[{ required: true, message: 'Digite sua senha!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={carregando}>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}