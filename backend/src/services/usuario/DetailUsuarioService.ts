import prismaClient from "../../prisma";

class DetailUsuarioService {
    async execute(usuario_id: string) {

        const usuario = await prismaClient.usuario.findFirst({
            where: {
                id: usuario_id
            },
            select: {
                id: true,
                name: true,
                email: true,
                cpf_cnpj: true,
                endereco: true,
                numero: true,
                bairro: true,
                cidade: true,
                ibge: true,
                estado: true,
                cep: true,
                telefone: true,
                img_usuario: true,
                isPeriodoTesteAtivo: true,
                isPlanoAtivo: true,
                dataFimPeriodoTeste: true,
                plano: {
                    select: {
                        nome: true,
                        descricao: true,
                        limiteEmpresas: true,
                        valor: true,
                    }
                }
            }
        })

        return usuario
    }
}

export { DetailUsuarioService }