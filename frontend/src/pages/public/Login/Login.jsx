import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/useAuth'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { toast } from 'sonner'

// Importando componentes
import { Input } from '../../../components/Input/Input'
import { ButtonAuth } from '../../../components/ButtonAuth/ButtonAuth'

// Estilos
import styles from '../Auth.module.scss'
import 'swiper/css';
import 'swiper/css/pagination';

// Icones
import * as PiIcons from "react-icons/pi";

// Imagens
import iconeLogo from '../../../assets/images/icone-logo.png'
import imgAuth from '../../../assets/images/imgAuth.jpg'
import cliente01 from '../../../assets/images/cliente01.png'
import cliente02 from '../../../assets/images/cliente02.png'
import cliente03 from '../../../assets/images/cliente03.png'
import cliente04 from '../../../assets/images/cliente04.png'

export const Login = () => {

    // Chamando Auth
    const auth = useAuth()

    // Dados incorretos
    const [campoEmailObrigatorio, setCampoEmailObrigatorio] = useState(false)
    const [campoPasswordObrigatorio, setCampoPasswordObrigatorio] = useState(false)

    // // Chamando history para redirecionar para outra pagina
    const navigate = useNavigate()

    // // armazenando dados preenchidos nos inputs
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    // // Funcao para logar
    async function handleSubmit(e) {
        e.preventDefault()

        // Validação dos campos
        const isEmailValid = email !== "";
        const isPasswordValid = password !== "";

        setCampoEmailObrigatorio(!isEmailValid);
        setCampoPasswordObrigatorio(!isPasswordValid);

        // Impede a continuação se algum campo estiver inválido
        if (!isEmailValid || !isPasswordValid) {
            toast.warning("Preencha todos os campos para continuar!")
            return;
        }

        setLoading(true)

        try {

            await auth.autenticacao(email, password)
            navigate("/dashboard")
            setLoading(false)

        } catch (error) {
            setLoading(false)
            return null
        }

    }

    return (

        <div className={styles.container_auth}>

            <div className={styles.box_form}>
                <div className={styles.form}>

                    <div className={styles.box_header_form}>
                        <div className={styles.box_logo_now_bi}>
                            <img src={iconeLogo} />
                            <p>NowBi</p>
                        </div>
                        <h2>Olá, bem vindo de volta!</h2>
                        <p>Insira suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label>
                            <p>Login:</p>
                            <Input type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${campoEmailObrigatorio ? styles.input_erro : ''}`} />

                            {campoEmailObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}
                        </label>
                        <label>
                            <p>Senha:</p>
                            <Input type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className={`${campoPasswordObrigatorio ? styles.input_erro : ''}`} />
                            {campoPasswordObrigatorio ? (
                                <span className={styles.preencher_campos}>*Campo obrigatório!</span>
                            ) : (
                                ''
                            )}
                        </label>

                        <ButtonAuth type="submit" loading={loading}>Entrar</ButtonAuth>

                    </form>

                    <Link to="/cadastro" className={styles.box_link}>

                        <div className={styles.link}>
                            <PiIcons.PiStarDuotone className={styles.icon} />
                            <div>
                                <p>Não tem uma conta?</p>
                                <p><span>Teste grátis por 7 dias!</span></p>
                            </div>
                        </div>

                        <PiIcons.PiCaretRight className={styles.icon} />
                    </Link>

                </div>
            </div>

            <div className={styles.box_img_auth}>
                <div className={styles.slide_auth}>
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                    >
                        <SwiperSlide>
                            <div className={styles.card_depoimento}>
                                <div className={styles.box_header_depoimento}>
                                    <div className={styles.box_stars_depoimento}>
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                    </div>
                                    <PiIcons.PiQuotesFill className={styles.icone_aspas} />
                                </div>
                                {/* <div className={styles.descricao_depoimento}>
                                    <p>Lorem ipsum dolor sit amet...</p>
                                </div> */}
                                <div className={styles.infos_usuario_depoimento}>
                                    <div className={styles.nome_depoimento}>
                                        <h3>Juan Kuester</h3>
                                        <p>Streetblanks</p>
                                    </div>
                                    <img src={cliente02} />
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={styles.card_depoimento}>
                                <div className={styles.box_header_depoimento}>
                                    <div className={styles.box_stars_depoimento}>
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                    </div>
                                    <PiIcons.PiQuotesFill className={styles.icone_aspas} />
                                </div>
                                {/* <div className={styles.descricao_depoimento}>
                                    <p>Lorem ipsum dolor sit amet...</p>
                                </div> */}
                                <div className={styles.infos_usuario_depoimento}>
                                    <div className={styles.nome_depoimento}>
                                        <h3>Naiara Tiesen</h3>
                                        <p>NP Gestão Financeira</p>
                                    </div>
                                    <img src={cliente01} />
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={styles.card_depoimento}>
                                <div className={styles.box_header_depoimento}>
                                    <div className={styles.box_stars_depoimento}>
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                    </div>
                                    <PiIcons.PiQuotesFill className={styles.icone_aspas} />
                                </div>
                                {/* <div className={styles.descricao_depoimento}>
                                    <p>Lorem ipsum dolor sit amet...</p>
                                </div> */}
                                <div className={styles.infos_usuario_depoimento}>
                                    <div className={styles.nome_depoimento}>
                                        <h3>Bruna Galperin</h3>
                                        <p>Salty Vibe</p>
                                    </div>
                                    <img src={cliente03} />
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={styles.card_depoimento}>
                                <div className={styles.box_header_depoimento}>
                                    <div className={styles.box_stars_depoimento}>
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                        <PiIcons.PiStarFill className={styles.estrela_ok} />
                                    </div>
                                    <PiIcons.PiQuotesFill className={styles.icone_aspas} />
                                </div>
                                {/* <div className={styles.descricao_depoimento}>
                                    <p>Lorem ipsum dolor sit amet...</p>
                                </div> */}
                                <div className={styles.infos_usuario_depoimento}>
                                    <div className={styles.nome_depoimento}>
                                        <h3>Vitor</h3>
                                        <p>Odonto Sul</p>
                                    </div>
                                    <img src={cliente04} />
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <img src={imgAuth} alt="" />
            </div>

        </div>
    )
}
