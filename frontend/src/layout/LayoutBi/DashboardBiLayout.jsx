import React from 'react'
import { Outlet } from 'react-router-dom'
import { BiPublicProvider,  } from '../../contexts/BiPublicContext'
import { HeaderBi } from '../../components/global/HeaderBi/HeaderBi'
import { MenuBi } from '../../components/global/MenuBi/MenuBi'
import styles from './DashboardBiLayout.module.scss'

export const DashboardBiLayout = () => {
  return (
    <BiPublicProvider>
      <main className={styles.layout_bi}>
        <HeaderBi />
        <MenuBi />
        <section className={styles.sectionBi}>
          <Outlet />
        </section>
      </main>
    </BiPublicProvider>
  )
}