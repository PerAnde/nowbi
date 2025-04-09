"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmpresasGrupoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateEmpresasGrupoService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, empresa_id, acao }) {
            if (!id || !empresa_id) {
                throw new Error("ID do grupo ou da empresa inválido!");
            }
            // Verifica se o grupo existe
            const grupoExiste = yield prisma_1.default.grupoEmpresa.findUnique({
                where: { id }
            });
            if (!grupoExiste) {
                throw new Error("Grupo não encontrado!");
            }
            // Verifica se a empresa existe
            const empresaExiste = yield prisma_1.default.empresa.findUnique({
                where: { id: empresa_id }
            });
            if (!empresaExiste) {
                throw new Error("Empresa não encontrada!");
            }
            if (acao === "adicionar") {
                // Adiciona a empresa ao grupo
                yield prisma_1.default.empresa.update({
                    where: { id: empresa_id },
                    data: { grupo_empresa_id: id },
                });
            }
            else if (acao === "remover") {
                // Remove a empresa do grupo
                yield prisma_1.default.empresa.update({
                    where: { id: empresa_id, grupo_empresa_id: id }, // Garante que a empresa pertence ao grupo
                    data: { grupo_empresa_id: null },
                });
            }
            else {
                throw new Error("Ação inválida! Use 'adicionar' ou 'remover'.");
            }
            // Retorna os dados atualizados do grupo
            const grupoAtualizado = yield prisma_1.default.grupoEmpresa.findUnique({
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
        });
    }
}
exports.UpdateEmpresasGrupoService = UpdateEmpresasGrupoService;
