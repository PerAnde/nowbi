import fs from 'fs';
import path from 'path';
import prismaClient from "../../prisma";

interface UpdateUsuarioRequest {
    id: string;
    name: string;
    cep?: string;
    endereco?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    ibge?: string;
    estado?: string;
    telefone?: string;
    img_usuario?: string;
}

class UpdateUsuarioService {

    async execute({ id, name, cep, endereco, numero, bairro, cidade, ibge, estado, telefone, img_usuario }: UpdateUsuarioRequest) {

        if (!id) {
            throw new Error("Id inválido!")
        }

        if (!name) {
            throw new Error("Insira seu nome ou razão social!")
        }

        const usuarioExiste = await prismaClient.usuario.findUnique({
            where: { id },
        })

        if (!usuarioExiste) {
            throw new Error("Usuário não encontrado!")
        }

        let imgUsuarioAtualizada = usuarioExiste.img_usuario;

        if (img_usuario) {
            // Caminho da pasta onde as logos estão salvas
            const logoPath = path.resolve(__dirname, '..', '..', '..', 'images');

            // Exclui a logo antiga, se houver
            if (usuarioExiste.img_usuario) {
                const logoAntigaPath = path.join(logoPath, usuarioExiste.img_usuario);

                if (fs.existsSync(logoAntigaPath)) {
                    fs.unlinkSync(logoAntigaPath);
                }
            }

            // Atualiza para a nova logo
            imgUsuarioAtualizada = img_usuario;
        }


        const updateUsuario = await prismaClient.usuario.update({
            where: { id },
            data: {
                name,
                cep,
                endereco,
                numero,
                bairro,
                cidade,
                ibge,
                estado,
                telefone,
                img_usuario: imgUsuarioAtualizada,
            },
            select: {
                id: true,
                name: true,
                cep: true,
                endereco: true,
                numero: true,
                bairro: true,
                cidade: true,
                ibge: true,
                estado: true,
                telefone: true,
                img_usuario: true,
            }
        })

        return updateUsuario

    }

}

export { UpdateUsuarioService }