import styles from './styles.module.scss'

import Link from 'next/link'

import Image from 'next/image'

import logoImg from '../../../../../public/icon-logo.svg'

export function Header() {
    return (
        <header className={styles.header}>

            <div className={styles.box_logo}>
                <Image src={logoImg} alt="Logo nowBi" width={25} />
                <p>now<span>BI</span></p>
            </div>

            <div className={styles.menu_header}>
                <Link href="/">Sair</Link>
            </div>

        </header>
    )
}