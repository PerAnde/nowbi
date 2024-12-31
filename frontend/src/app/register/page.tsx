import styles from '../page.module.scss'

import logoImg from '../../../public/icon-logo.svg'

import Image from 'next/image'
import Link from 'next/link';

import { api } from '@/services/api'

import { redirect } from 'next/navigation';

export default function Register() {

    async function handleRegister(formData: FormData) {
        "use server"

        const name = formData.get("name")
        const email = formData.get("email")
        const cpf_cnpj = formData.get("cpf_cnpj")
        const password = formData.get("password")

        if (name === "" || email === "" || cpf_cnpj === "" || password === "") {
            console.log("Preencha todos os campos!")
            return;
        }

        try {
            await api.post("/register", {
                name,
                email,
                cpf_cnpj,
                password
            })
        } catch (err) {
            console.log(err)
        }

        redirect("/")
    }

    return (
        <div className={styles.container_auth}>

            <div className={styles.form_auth}>

                <div className={styles.box_logo}>
                    <Image src={logoImg} alt="Logo nowBi" />
                    <p>now<span>BI</span></p>
                </div>

                <div className={styles.text_form}>
                    <h2>Cadastre-se</h2>
                    <p>Preencha os campos abaixo para criar sua conta</p>
                </div>

                <form action={handleRegister}>
                    <label>Nome Completo / Razão Social</label>
                    <input type='text' required name='name' placeholder='Seu nome ou razão social' />
                    <label>Email</label>
                    <input type='email' required name='email' placeholder='Seu email' />
                    <label>CPF / CNPJ</label>
                    <input type='text' required name='cpf_cnpj' placeholder='Seu CPF ou CNPJ' />
                    <label>Senha</label>
                    <input type='password' required name='password' placeholder='Sua senha' />
                    <label>Confirmar Senha</label>
                    <input type='password' required name='confirmpassword' placeholder='Confirme sua senha' />

                    <button type='submit'>Criar conta</button>
                </form>

                <hr />

                <Link href='/'>Já possui uma conta? <span>Faça o login</span></Link>
            </div>
        </div>
    );
}
