import prismaClient from "../../prisma";
import crypto from 'crypto'

interface EmpresaRequest {
    name: string;
    cnpj_empresa: string;
    logo_empresa?: string;
    email_empresa: string;
    usuario_id: string;
}

class CreateEmpresaService {
    async execute({ name, cnpj_empresa, logo_empresa, email_empresa, usuario_id }: EmpresaRequest) {

        if (!name || !usuario_id) {
            throw new Error("Nome ou ID inválido!")
        }

        if (!cnpj_empresa) {
            throw new Error("Insira o CNPJ da empresa!")
        }

        if (!email_empresa) {
            throw new Error("Insira o email da empresa!")
        }

        const link_bi = crypto.randomBytes(20).toString("hex");

        const empresa = await prismaClient.empresa.create({
            data: {
                name: name,
                cnpj_empresa: cnpj_empresa,
                logo_empresa: logo_empresa,
                email_empresa: email_empresa,
                usuario_id: usuario_id,
                link_bi: link_bi,
            },
            select: {
                id: true,
                name: true,
                cnpj_empresa: true,
                logo_empresa: true,
                email_empresa: true,
                usuario_id: true,
                link_bi: true,
            }
        })

        return empresa

    }
}

export { CreateEmpresaService }