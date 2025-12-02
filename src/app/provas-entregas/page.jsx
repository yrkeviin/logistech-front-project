'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import HeaderLogis from '../../components/HeaderLogis/HeaderLogis';
import styles from './page.module.css';

export default function ProvasEntregas() {
  const router = useRouter();
  const [motorista, setMotorista] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    primeiroNome: '',
    segundoNome: '',
    cpf: '',
    entregaId: ''
  });
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    const motoristaData = localStorage.getItem('motorista');
    if (!motoristaData) {
      router.push('/login-motorista');
      return;
    }

    const motoristaObj = JSON.parse(motoristaData);
    setMotorista(motoristaObj);
    fetchEntregasPendentes(motoristaObj.id);
  }, []);

  const fetchEntregasPendentes = async (motoristaId) => {
    try {
      const response = await fetch(`/api/entregas?motorista_id=${motoristaId}&status=EM_ROTA`);
      const data = await response.json();
      setEntregas(data);
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }));
  };

  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.length === 11;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.primeiroNome.trim()) {
      alert('Por favor, insira o primeiro nome');
      return false;
    }
    if (!formData.segundoNome.trim()) {
      alert('Por favor, insira o segundo nome');
      return false;
    }
    if (!formData.cpf.trim() || !validateCPF(formData.cpf)) {
      alert('Por favor, insira um CPF válido');
      return false;
    }
    if (!formData.entregaId) {
      alert('Por favor, selecione uma entrega');
      return false;
    }
    if (files.length === 0) {
      alert('Por favor, adicione pelo menos uma foto como comprovante');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const comprovante = `${formData.primeiroNome}_${formData.segundoNome}_${Date.now()}`;

      const response = await fetch(`/api/entregas/${formData.entregaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ENTREGUE',
          comprovante: comprovante,
          entregue_em: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Comprovante de entrega enviado com sucesso!');
        setFormData({
          primeiroNome: '',
          segundoNome: '',
          cpf: '',
          entregaId: ''
        });
        setFiles([]);
        fetchEntregasPendentes(motorista.id);
      } else {
        throw new Error('Erro ao enviar comprovante');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar comprovante de entrega');
    } finally {
      setLoading(false);
    }
  };

  if (!motorista) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <HeaderLogis />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Comprovante de Entrega</h1>
          <p className={styles.subtitle}>
            Registre a entrega e faça o upload do comprovante
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Primeiro Nome:</label>
              <input
                type="text"
                name="primeiroNome"
                value={formData.primeiroNome}
                onChange={handleInputChange}
                placeholder="Primeiro Nome"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Segundo Nome:</label>
              <input
                type="text"
                name="segundoNome"
                value={formData.segundoNome}
                onChange={handleInputChange}
                placeholder="Segundo Nome"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>CPF:</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Entrega:</label>
            <select
              name="entregaId"
              value={formData.entregaId}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione uma entrega</option>
              {entregas.map(entrega => (
                <option key={entrega.id} value={entrega.id}>
                  Pedido #{entrega.pedido.numero_pedido} - {entrega.pedido.endereco_cliente}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Upload Fotos:</label>
            <div
              className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div className={styles.uploadIcon}>
                <svg className={styles.uploadSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p>
                <strong>Upload a File</strong><br />
                Drag and drop files here
              </p>
            </div>

            {files.length > 0 && (
              <div className={styles.fileList}>
                {files.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <div className={styles.fileIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span>{file.name}</span>
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className={styles.removeBtn}
                      title="Remover arquivo"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Comprovante'}
          </button>
        </form>
      </div>
    </div>
  );
}
