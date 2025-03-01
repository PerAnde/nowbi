import fs from 'fs';
import path from 'path';
import prismaClient from "../../prisma";

interface UpdateEmpresaRequest {
    id: string;
    usuario_id: string;
    name: string;
    cnpj_empresa: string;
    logo_empresa?: string;
}

class UpdateEmpresaService {
    async execute({ id, usuario_id, name, cnpj_empresa, logo_empresa }: UpdateEmpresaRequest) {
        if (!id) {
            throw new Error("Id inválido!")
        }

        const empresaExiste = await prismaClient.empresa.findUnique({
            where: { id },
            select: {
                usuario_id: true,
                logo_empresa: true,
            }
        });

        if (!empresaExiste) {
            throw new Error("Empresa não encontrada!");
        }

        if (empresaExiste.usuario_id !== usuario_id) {
            throw new Error("Empresa não encontrada!")
        }

        let logoAtualizada = empresaExiste.logo_empresa;

        if (logo_empresa) {
            // Caminho da pasta onde as logos estão salvas
            const logoPath = path.resolve(__dirname, '..', '..', '..', 'images');

            // Exclui a logo antiga, se houver
            if (empresaExiste.logo_empresa) {
                const logoAntigaPath = path.join(logoPath, empresaExiste.logo_empresa);

                if (fs.existsSync(logoAntigaPath)) {
                    fs.unlinkSync(logoAntigaPath);
                }
            }

            // Atualiza para a nova logo
            logoAtualizada = logo_empresa;
        }

        const updateEmpresa = await prismaClient.empresa.update({
            where: { id },
            data: {
                name,
                cnpj_empresa,
                logo_empresa: logoAtualizada,
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