import React from 'react'
import HeaderAdm from "../../components/HeaderAdm/HeaderAdm"
import styles from './page.module.css'

export default function HomeAdm() {
  return (
    <div className={styles.container}>
      <HeaderAdm />

      <div className={styles.dashboard}>
        <div className={styles.quadrados}>
          <div className={styles.quadrados1}>
            <div className={styles.quadrado}></div>
            <div className={styles.quadrado}></div>
          </div>

          <div className={styles.quadrados2}>
            <div className={styles.quadrado}></div>
            <div className={styles.quadrado}></div>
          </div>
        </div>

        <h1>Dashboard:</h1>
      </div>

      <div className={styles.dash}>
        <div className={styles.cardStatus}>
          <div className={styles.banner}>
              <h1>Pendentes</h1>
          </div>

          <p>Aqui está um banner com tons de amarelo, mantendo o mesmo estilo abstrato de logística, sem ícones ou escrita.</p>
        </div>

        <div className={styles.cardStatus}>
          <div className={styles.banner2}>
              <h1>A Caminho</h1>
          </div>

          <p>Aqui está um banner com tons de azul, mantendo o mesmo estilo abstrato de logística, sem ícones ou escrita.</p>
        </div>

        <div className={styles.cardStatus}>
          <div className={styles.banner3}>
              <h1>Entregues</h1>
          </div>

          <p>Aqui está um banner com tons de azul, mantendo o mesmo estilo abstrato de logística, sem ícones ou escrita.</p>
        </div>
      </div>

      <div className={styles.separator}></div>

    </div>
  )
}
