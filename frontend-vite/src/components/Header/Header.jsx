import styles from './Header.module.scss'

// Imagens
import iconeLogo from '../../assets/images/icone-logo.svg'

export const Header = () => {

    return (
        <div className={styles.box_header}>

            <div className={styles.box_logo_now_bi}>
                <img src={iconeLogo} />
                <p>now<span>BI</span></p>
            </div>

            <div className={styles.box_menu_header}>
                <p>Menu Header</p>
            </div>

        </div>
    )
}
