'use client';
import React from 'react';
import styles from './HeaderMotorista.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HeaderMotorista() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('motorista');
    router.push('/login-motorista');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/image/logoLogis.png" alt="LogisTech" width={150} height={50} className={styles.logoImage} />
        <span className={styles.subtitle}>Motorista</span>
      </div>

      <nav className={styles.nav}>
        <a href="/minhas-entregas" className={styles.navLink}>
          Minhas Entregas
        </a>
        <a href="/provas-entregas" className={styles.navLink}>
          Comprovantes
        </a>
        <a href="/perfil-motorista" className={styles.navLink}>
          Perfil
        </a>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sair
        </button>
      </nav>
    </header>
  );
}
