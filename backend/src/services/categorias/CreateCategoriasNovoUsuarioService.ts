import prismaClient from "../../prisma";

interface CategoriaData {
    usuario_id: string;
}

class CreateCategoriasNovoUsuarioService {

    async execute({ usuario_id }: CategoriaData) {

        await prismaClient.categoria.createMany({
            data: [
                {
                    name: "Salário",
                    tipo: "RECEITA",
                    usuario_id: usuario_id
                }
            ]
        })

    }

}

export { CreateCategoriasNovoUsuarioService }