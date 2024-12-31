import styles from './page.module.scss'

import logoImg from '../../public/icon-logo.svg'

import Image from 'next/image'
import Link from 'next/link';

import { api } from '@/services/api';
import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';

export default function Home() {

    async function handleLogin(formData: FormData) {

        "use server"

        const email = formData.get("email")
        const password = formData.get("password")

        if (email === "" || password === "") {
            return;
        }

        try {

            const response = await api.post("/login", {
                email,
                password
            })

            if (!response.data.token) {
                return;
            }

            console.log(response.data)

            const cookieToken = await cookies();

            const expressTime = 60 * 60 * 24 * 30 * 1000;
            cookieToken.set("token", response.data.token, {
                maxAge: expressTime,
                path: "/",
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production'
            })

        } catch (err) {
            console.log(err)
            return;
        }

        redirect("/dashboard")

    }

    return (
        <div className={styles.container_auth}>

            <div className={styles.form_auth}>

                <div className={styles.box_logo}>
                    <Image src={logoImg} alt="Logo nowBi" />
                    <p>now<span>BI</span></p>
                </div>

                <div className={styles.text_form}>
                    <h2>Olá, seja bem-vindo!</h2>
                    <p>Insira suas credenciais para continuar</p>
                </div>

                <form action={handleLogin}>
                    <label>Email</label>
                    <input type='email' required name='email' placeholder='Seu email' />
                    <label>Senha</label>
                    <input type='password' required name='password' placeholder='Sua senha' />

                    <button type='submit'>Acessar</button>
                </form>

                <hr />

                <Link href='/register'>Não possui uma conta? <span>Cadastre-se</span></Link>
            </div>
        </div>
    );
}
