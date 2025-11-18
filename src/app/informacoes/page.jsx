import React from 'react'
import styles from './page.module.css'
import HeaderLogis from "../../components/HeaderLogis/HeaderLogis"
import CardMini from '../../components/CardMini/CardMini'

export default function Informacoes() {
  return (
    <div className={styles.container}>
        <HeaderLogis />

        <h1 className={styles.title}>Informações das Entregas:</h1>

      <div className={styles.cards}>
        <CardMini
        icon="/image/icon1.png"
        number="2345"
        description="Pedidos Totais"
        />
        <CardMini
        icon="/image/icon2.png"
        number="2345"
        description="Pedidos Totais"
        />
        <CardMini
        icon="/image/icon3.png"
        number="2345"
        description="Pedidos Totais"
        />
        <CardMini
        icon="/image/icon4.png"
        number="2345"
        description="Pedidos Totais"
        />
      </div>

      <div className={styles.slogan}>
        <p>Siga o <span>mapa</span> e faça suas entregas!</p>

        <img src="/image/caminhaoSlogan.png" alt="" />
      </div>
    </div>
  )
}
