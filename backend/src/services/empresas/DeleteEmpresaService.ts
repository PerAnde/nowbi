import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

class DeleteEmpresaService {
    async execute(id: string, usuario_id: string): Promise<void> {
        // Verifica se a empresa existe
        const empresa = await prismaClient.empresa.findUnique({
            where: {
                id,
            },
            select: {
                usuario_id: true,
                logo_empresa: true,
            }
        });

        if (!empresa) {
            throw new Error("Empresa não encontrada!");
        }

        if (empresa.usuario_id !== usuario_id) {
            throw new Error("Empresa não encontrada!");
        }

        // Remove a imagem se existir
        if (empresa.logo_empresa) {
            const logoPath = path.resolve(__dirname, '..', '..', '..', 'images', empresa.logo_empresa);

            if (fs.existsSync(logoPath)) {
                fs.unlinkSync(logoPath);
            }
        }

        const businessIntelligences = await prismaClient.businessIntelligence.findMany({
            where: {
                empresa_id: id,
            },
            select: {
                id: true,
            }
        });

        const biIds = businessIntelligences.map(bi => bi.id);

        if (biIds.length > 0) {
            await prismaClient.lancamentoBi.deleteMany({
                where: {
                    businessIntelligence_id: {
                        in: biIds,
                    }
                }
            });

            await prismaClient.businessIntelligence.deleteMany({
                where: {
                    empresa_id: id,
                }
            });
        }

        // Remove a empresa
        await prismaClient.empresa.delete({
            where: {
                id,
            },
        });
    }
}

export { DeleteEmpresaService };
