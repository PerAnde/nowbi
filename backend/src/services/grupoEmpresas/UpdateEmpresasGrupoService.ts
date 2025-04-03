import prismaClient from "../../prisma";

interface UpdateEmpresasGrupoRequest {
    id: string; // ID do grupo
    empresa_id: string; // ID da empresa
    acao: "adicionar" | "remover"; // Define se a empresa será adicionada ou removida
}

class UpdateEmpresasGrupoService {
    async execute({ id, empresa_id, acao }: UpdateEmpresasGrupoRequest) {
        if (!id || !empresa_id) {
            throw new Error("ID do grupo ou da empresa inválido!");
        }

        // Verifica se o grupo existe
        const grupoExiste = await prismaClient.grupoEmpresa.findUnique({
            where: { id }
        });

        if (!grupoExiste) {
            throw new Error("Grupo não encontrado!");
        }

        // Verifica se a empresa existe
        const empresaExiste = await prismaClient.empresa.findUnique({
            where: { id: empresa_id }
        });

        if (!empresaExiste) {
            throw new Error("Empresa não encontrada!");
        }

        if (acao === "adicionar") {
            // Adiciona a empresa ao grupo
            await prismaClient.empresa.update({
                where: { id: empresa_id },
                data: { grupo_empresa_id: id },
            });
        } else if (acao === "remover") {
            // Remove a empresa do grupo
            await prismaClient.empresa.update({
                where: { id: empresa_id, grupo_empresa_id: id }, // Garante que a empresa pertence ao grupo
                data: { grupo_empresa_id: null },
            });
        } else {
            throw new Error("Ação inválida! Use 'adicionar' ou 'remover'.");
        }

        // Retorna os dados atualizados do grupo
        const grupoAtualizado = await prismaClient.grupoEmpresa.findUnique({
            where: { id },
            include: {
                empresas: {
                    select: {
                        name: true,
                        cnpj_empresa: true,
                        email_empresa: true,
                    },
                },
            },
        });

        return grupoAtualizado;
    }
}

export { UpdateEmpresasGrupoService };
