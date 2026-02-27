import prismaClient from "../../prisma";

interface DeleteRequest {
    empresa_id: string;
    usuario_id: string;
}

class DeleteIntegracaoService {
    async execute({ empresa_id, usuario_id }: DeleteRequest): Promise<void> {

        // 1. Validar se a empresa existe e pertence ao usuário
        const empresa = await prismaClient.empresa.findFirst({
            where: {
                id: empresa_id,
                usuario_id: usuario_id
            }
        });

        if (!empresa) {
            throw new Error("Empresa não encontrada ou permissão negada.");
        }

        // 2. Verificar se existe uma integração ativa
        const integracao = await prismaClient.blingIntegration.findFirst({
            where: {
                empresaId: empresa_id
            }
        });

        if (!integracao) {
            throw new Error("Não existe integração ativa para esta empresa.");
        }

        // 3. Remover a integração
        // Usamos deleteMany com empresaId para garantir a remoção mesmo se o ID da integração não for passado
        await prismaClient.blingIntegration.deleteMany({
            where: {
                empresaId: empresa_id
            }
        });

        // Opcional: Se você quiser deletar os dados importados (BI) 
        // ao remover a integração, você deve adicionar os deletes de lancamentos aqui.
        // Se quiser apenas "desconectar" o Bling, o código acima é suficiente.
    }
}

export { DeleteIntegracaoService };