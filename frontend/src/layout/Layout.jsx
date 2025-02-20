import { useState, useEffect } from "react"
import { Header } from "../components/global/Header/Header"
import { MenuLateral } from "../components/global/MenuLateral/MenuLateral"
import { Footer } from "../components/global/Footer/Footer"

import styles from './Layout.module.scss'

export const Layout = ({ children }) => {

    const [menuLateralAberto, setMenuLateralAberto] = useState(false)

    useEffect(() => {
        if (menuLateralAberto) {
            document.body.style.overflow = 'hidden'; // Desativa o scroll
        } else {
            document.body.style.overflow = 'auto'; // Restaura o scroll
        }
    }, [menuLateralAberto]);

    return (
        <main className={styles.layout}>

            <header className={styles.header}>
                <Header setMenuLateralAberto={setMenuLateralAberto} />
            </header>

            <nav className={styles.nav}>
                <MenuLateral menuLateralAberto={menuLateralAberto} setMenuLateralAberto={setMenuLateralAberto} />
            </nav>

            <section className={styles.section}>
                {menuLateralAberto ? (
                    <div className={styles.menuLateralAberto}></div>
                ) : (
                    ''
                )}

                {children}
            </section>

            <footer className={styles.footer}>
                <Footer />
            </footer>

        </main>
    )
}
