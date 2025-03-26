import prismaClient from "../../prisma";

interface UpdateEmpresasGrupoRequest {
    id: string;
    adicionar_empresa?: string[];
    remover_empresa?: string[];
}

class UpdateEmpresasGrupoService {
    async execute({ id, adicionar_empresa, remover_empresa }: UpdateEmpresasGrupoRequest) {
        if (!id) {
            throw new Error("ID inválido!");
        }

        const grupoExiste = await prismaClient.grupoEmpresa.findUnique({
            where: { id },
            include: { empresas: true },
        });

        if (!grupoExiste) {
            throw new Error("Grupo não encontrado!");
        }

        // Filtra apenas empresas que estão associadas ao grupo
        const empresasAtuaisIds = grupoExiste.empresas.map(empresa => empresa.id);

        const empresasRemoverFiltradas = remover_empresa
            ? remover_empresa.filter(empresa_id => empresasAtuaisIds.includes(empresa_id))
            : [];

        // Remove a relação do grupo antigo
        if (empresasRemoverFiltradas.length > 0) {
            await prismaClient.empresa.updateMany({
                where: {
                    id: { in: empresasRemoverFiltradas },
                    grupo_empresa_id: id, // Garante que a empresa pertence ao grupo antes de remover
                },
                data: {
                    grupo_empresa_id: null, // Remove a empresa do grupo
                },
            });
        }

        // Adiciona novas empresas ao grupo
        if (adicionar_empresa && adicionar_empresa.length > 0) {
            await prismaClient.empresa.updateMany({
                where: {
                    id: { in: adicionar_empresa },
                },
                data: {
                    grupo_empresa_id: id, // Associa a empresa ao grupo
                },
            });
        }

        // Retorna os dados atualizados
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
