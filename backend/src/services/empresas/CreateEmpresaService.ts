import prismaClient from "../../prisma";
import crypto from 'crypto'

import { CreateCategoriasNovaEmpresaService } from "../categorias/CreateCategoriasNovaEmpresaService";

interface EmpresaRequest {
    name: string;
    cnpj_empresa: string;
    logo_empresa?: string;
    email_empresa: string;
    usuario_id: string;
    categorias_padrao: boolean;
}

class CreateEmpresaService {
    async execute({ name, cnpj_empresa, logo_empresa, email_empresa, usuario_id, categorias_padrao }: EmpresaRequest) {

        if (!name || !usuario_id) {
            throw new Error("Nome ou ID inválido!")
        }

        if (!cnpj_empresa) {
            throw new Error("Insira o CNPJ da empresa!")
        }

        // if (!email_empresa) {
        //     throw new Error("Insira o email da empresa!")
        // }

        // Buscando plano do usuario
        const usuario = await prismaClient.usuario.findUnique({
            where: { id: usuario_id },
            select: {
                id: true,
                plano_id: true,
            }
        })

        if (!usuario) {
            throw new Error("Usuário não encontrado!")
        }

        // Buscando limite do plano
        const plano = await prismaClient.plano.findUnique({
            where: { id: usuario.plano_id },
            select: {
                limiteEmpresas: true,
                nome: true,
            }
        })

        if (!plano) {
            throw new Error("Plano do usuário não encontrado!")
        }

        // Verificando quantas empresas o usuario ja tem
        const totalEmpresas = await prismaClient.empresa.count({
            where: { usuario_id }
        })

        // Verificar se ja atingiu o limite
        if (totalEmpresas >= plano.limiteEmpresas) {
            throw new Error(`Limite de empresas do plano "${plano.nome}" atingido. Faça upgrade para criar mais empresas.`)
        }

        const link_bi = crypto.randomBytes(20).toString("hex");

        const pin_acesso = Math.floor(1000 + Math.random() * 9000);

        const empresa = await prismaClient.empresa.create({
            data: {
                name: name.toLowerCase().trim(),
                cnpj_empresa: cnpj_empresa,
                logo_empresa: logo_empresa,
                email_empresa: email_empresa,
                usuario_id: usuario_id,
                link_bi: link_bi,
                pin_acesso,
            },
            select: {
                id: true,
                name: true,
                cnpj_empresa: true,
                logo_empresa: true,
                email_empresa: true,
                usuario_id: true,
                link_bi: true,
                pin_acesso: true,
            }
        })

        if (categorias_padrao) {
            const createCategoriasService = new CreateCategoriasNovaEmpresaService();

            try {
                await createCategoriasService.execute({
                    usuario_id: usuario.id,
                    empresa_id: empresa.id
                })
            } catch (error) {
                console.error("Erro ao criar categorias iniciais:", error);
            }
        }

        return empresa

    }
}

export { CreateEmpresaService }