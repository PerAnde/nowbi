import prismaClient from "../../prisma";

interface GetPinAcessoRequest {
    id: string;
    usuario_id: string;
}

class GetPinAcessoService {
    async execute({ id, usuario_id }: GetPinAcessoRequest) {
        if (!id) {
            throw new Error("ID inválido!");
        }

        const empresa = await prismaClient.empresa.findUnique({
            where: { id },
            select: { usuario_id: true, pin_acesso: true },
        });

        if (!empresa) {
            throw new Error("Empresa não encontrada!");
        }

        if (empresa.usuario_id !== usuario_id) {
            throw new Error("Empresa não encontrada!");
        }

        return { pin_acesso: empresa.pin_acesso };
    }
}

export { GetPinAcessoService };
