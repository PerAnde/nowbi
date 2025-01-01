import { Header } from "../components/Header/Header"

export const Layout = ({ children }) => {
    return (
        <main>

            <header>
                <Header />
            </header>

            <section>
                {children}
            </section>

        </main>
    )
}
