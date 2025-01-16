import prismaClient from "../../prisma";

interface UpdateEmpresaRequest {
    id: string;
    name: string;
    cnpj_empresa: string;
    logo_empresa?: string;
}

class UpdateEmpresaService {
    async execute({ id, name, cnpj_empresa, logo_empresa }: UpdateEmpresaRequest) {
        if (!id) {
            throw new Error("Id inválido!")
        }

        const empresaExiste = await prismaClient.empresa.findUnique({
            where: { id },
        });

        if (!empresaExiste) {
            throw new Error("Empresa não encontrada!");
        }

        const updateEmpresa = await prismaClient.empresa.update({
            where: { id },
            data: {
                name,
                cnpj_empresa,
                logo_empresa,
            },
            select: {
                id: true,
                name: true,
                cnpj_empresa: true,
                logo_empresa: true,
            },
        });

        return updateEmpresa
    }
}

export { UpdateEmpresaService }