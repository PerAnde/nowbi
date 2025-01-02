import { Header } from "../components/Header/Header"
import { MenuLateral } from "../components/MenuLateral/MenuLateral"

import styles from './Layout.module.scss'

export const Layout = ({ children }) => {
    return (
        <main className={styles.layout}>

            <header className={styles.header}>
                <Header />
            </header>

            <nav className={styles.nav}>
                <MenuLateral />
            </nav>

            <section className={styles.section}>
                {children}
            </section>

            <footer className={styles.footer}>
                <p>Footer do sistema</p>
            </footer>

        </main>
    )
}
