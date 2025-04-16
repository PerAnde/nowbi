import prismaClient from "../../prisma";

interface UpdateGrupoRequest {
    id: string;
    name: string;
    email_grupo?: string;
}

class UpdateGrupoService {
    async execute({ id, name }: UpdateGrupoRequest) {
        if (!id || !name) {
            throw new Error("Dados inválidos!")
        }

        const gropoExiste = await prismaClient.grupoEmpresa.findUnique({
            where: { id },
        });

        if (!gropoExiste) {
            throw new Error("Grupo não encontrado!");
        }

        const grupoEmpresa = await prismaClient.grupoEmpresa.update({
            where: { id },
            data: {
                name,
                email_grupo: null, // null oor enquanto
            },
            select: {
                id: true,
                name: true,
                email_grupo: true,
            },
        });

        return grupoEmpresa
    }
}

export { UpdateGrupoService }