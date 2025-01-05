import prismaClient from "../../prisma";

interface EmpresaRequest {
    name: string;
    logo_empresa?: string;
    usuario_id: string;
}

class CreateEmpresaService {
    async execute({ name, logo_empresa, usuario_id }: EmpresaRequest) {

        if (name === "") {
            throw new Error("Nome inválido!")
        }

        const empresa = await prismaClient.empresa.create({
            data: {
                name: name,
                logo_empresa: logo_empresa,
                usuario_id: usuario_id
            },
            select: {
                id: true,
                name: true,
                logo_empresa: true,
                usuario_id: true,
            }
        })

        return empresa

    }
}

export { CreateEmpresaService }