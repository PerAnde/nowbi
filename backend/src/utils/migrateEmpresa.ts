import prismaClient from "../prisma";
import { TipoCategoria, GrupoDre } from "@prisma/client";

// Mantenha suas interfaces exatamente como estão...
interface CategoriaInclude {
    id: string;
    name: string;
    tipo: TipoCategoria;
    grupoDre: GrupoDre;
    usuario_id: string;
    empresaId: string | null;
    id_externo: string | null;
    origem: string | null;
}

interface SubCategoriaInclude {
    id: string;
    name: string;
    categoria_id: string;
    empresaId: string | null;
}

// Sua função atual (mantenha a lógica interna dela)
async function migrarEmpresaCompleta(empresaId: string) {
    console.log(`--- 🚀 Iniciando Migração: Empresa ${empresaId} ---`);

    try {
        const lancamentos = await prismaClient.lancamentoBi.findMany({
            where: {
                businessIntelligence: {
                    empresa_id: empresaId,
                },
                OR: [
                    { categoria: { empresaId: null } },
                    { subcategoria: { empresaId: null } },
                ],
            },
            include: {
                categoria: true,
                subcategoria: true,
            },
        });

        if (lancamentos.length === 0) {
            console.log(`ℹ️ Empresa ${empresaId}: Nenhum lançamento global.`);
            return;
        }

        const cacheCategorias = new Map<string, string>();
        const cacheSubcategorias = new Map<string, string>();

        for (const lancamento of lancamentos) {
            const catGlobal = lancamento.categoria as unknown as CategoriaInclude;
            const subGlobal = lancamento.subcategoria as unknown as SubCategoriaInclude | null;

            const chaveCat = `${catGlobal.name.trim().toLowerCase()}-${catGlobal.tipo}`;
            let novaCatId = cacheCategorias.get(chaveCat);

            if (!novaCatId) {
                let catDestino = await prismaClient.categoria.findFirst({
                    where: {
                        name: catGlobal.name,
                        tipo: catGlobal.tipo,
                        empresaId: empresaId
                    },
                });

                if (!catDestino) {
                    catDestino = await prismaClient.categoria.create({
                        data: {
                            name: catGlobal.name,
                            tipo: catGlobal.tipo,
                            grupoDre: catGlobal.grupoDre,
                            usuario_id: catGlobal.usuario_id,
                            empresaId: empresaId,
                            origem: "MIGRACAO_BI",
                            id_externo: catGlobal.id_externo
                        },
                    });
                }
                novaCatId = catDestino.id;
                cacheCategorias.set(chaveCat, novaCatId);
            }

            let novaSubId = lancamento.subcategoria_id;

            if (subGlobal && subGlobal.empresaId === null) {
                const chaveSub = `${subGlobal.name.trim().toLowerCase()}-${novaCatId}`;
                let subIdCache = cacheSubcategorias.get(chaveSub);

                if (!subIdCache) {
                    let subDestino = await prismaClient.subCategoria.findFirst({
                        where: {
                            name: subGlobal.name,
                            categoria_id: novaCatId,
                            empresaId: empresaId
                        },
                    });

                    if (!subDestino) {
                        subDestino = await prismaClient.subCategoria.create({
                            data: {
                                name: subGlobal.name,
                                categoria_id: novaCatId,
                                empresaId: empresaId,
                            },
                        });
                    }
                    subIdCache = subDestino.id;
                    cacheSubcategorias.set(chaveSub, subIdCache);
                }
                novaSubId = subIdCache;
            }

            await prismaClient.lancamentoBi.update({
                where: { id: lancamento.id },
                data: {
                    categoria_id: novaCatId,
                    subcategoria_id: novaSubId,
                },
            });
        }

        console.log(`--- ✅ Concluído para ${empresaId} ---`);
    } catch (error) {
        console.error(`❌ Erro na empresa ${empresaId}:`, error);
    }
}

// --- NOVA FUNÇÃO PARA RODAR EM TODAS ---
async function migrarTodasAsEmpresas() {
    console.log("🏁 Buscando todas as empresas para migração...");

    try {
        // Busca apenas os IDs de todas as empresas
        const empresas = await prismaClient.empresa.findMany({
            select: { id: true, name: true }
        });

        console.log(`🏢 Encontradas ${empresas.length} empresas.`);

        for (const empresa of empresas) {
            // Executa a migração para cada uma delas, uma por uma
            await migrarEmpresaCompleta(empresa.id);
        }

        console.log("\n✨🏆 MIGRAÇÃO FINALIZADA PARA TODAS AS EMPRESAS! 🏆✨");

    } catch (err) {
        console.error("❌ Erro ao buscar lista de empresas:", err);
    }
}

// Inicia o processo global
migrarTodasAsEmpresas();