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
exports.UpdateLancamentoBiService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateLancamentoBiService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, valor, tipo, categoria, subcategoria }) {
            if (!id) {
                throw new Error("ID inválido!");
            }
            if (!valor) {
                throw new Error("Valor inválido!");
            }
            if (!['RECEITA', 'DESPESA'].includes(tipo)) {
                throw new Error("Tipo inválido!");
            }
            if (!categoria) {
                throw new Error("Categoria inválida!");
            }
            // Valida se o lancamento existe
            const lancamentoExiste = yield prisma_1.default.lancamentoBi.findUnique({
                where: { id },
            });
            if (!lancamentoExiste) {
                throw new Error("Lançamento não encontrado!");
            }
            // Busca a categoria no banco de dados
            const categoriaExiste = yield prisma_1.default.categoria.findUnique({
                where: { id: categoria },
                select: { tipo: true }
            });
            if (!categoriaExiste) {
                throw new Error("Categoria não encontrada!");
            }
            // Valida se o tipo da categoria corresponde ao tipo do lançamento
            if (categoriaExiste.tipo !== tipo) {
                throw new Error(`A categoria informada pertence ao tipo ${categoriaExiste.tipo}, mas o lançamento é do tipo ${tipo}.`);
            }
            if (subcategoria) {
                const subcategoriaExiste = yield prisma_1.default.subCategoria.findUnique({
                    where: { id: subcategoria },
                    select: { categoria_id: true }
                });
                if (!subcategoriaExiste) {
                    throw new Error("Subcategoria não encontrada!");
                }
                if (subcategoriaExiste.categoria_id !== categoria) {
                    throw new Error("A subcategoria informada não pertence à categoria selecionada!");
                }
            }
            const updateCategoria = yield prisma_1.default.lancamentoBi.update({
                where: { id },
                data: {
                    valor,
                    tipo,
                    categoria: { connect: { id: categoria } },
                    subcategoria: subcategoria ? { connect: { id: subcategoria } } : { disconnect: true }
                },
                select: {
                    id: true,
                    valor: true,
                    tipo: true,
                    categoria: true,
                    subcategoria: true
                }
            });
            return updateCategoria;
        });
    }
}
exports.UpdateLancamentoBiService = UpdateLancamentoBiService;
