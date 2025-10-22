import prismaClient from "../../prisma";

interface UpdatePinAcessoRequest {
    id: string;
    usuario_id: string;
    pin_acesso: string;
}

class UpdatePinAcessoService {

    async execute({ id, usuario_id, pin_acesso }: UpdatePinAcessoRequest) {
        if (!id) {
            throw new Error("Id inválido!")
        }

        const empresa = await prismaClient.empresa.findUnique({
            where: { id },
            select: { usuario_id: true }
        })

        if (!empresa) {
            throw new Error("Empresa não encontrada!");
        }

        if (empresa.usuario_id !== usuario_id) {
            throw new Error("Empresa não encontrada!");
        }

        const empresaAtualizada = await prismaClient.empresa.update({
            where: { id },
            data: { pin_acesso: pin_acesso ? Number(pin_acesso) : null },
            select: {
                id: true,
                name: true,
                pin_acesso: true,
            }
        })

        return empresaAtualizada;
    }
}

export { UpdatePinAcessoService }