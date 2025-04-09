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
exports.UpdateCategoriaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateCategoriaService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, tipo }) {
            if (!id) {
                throw new Error("Id inválido!");
            }
            const categoriaExiste = yield prisma_1.default.categoria.findUnique({
                where: { id },
            });
            if (!categoriaExiste) {
                throw new Error("Categoria não encontrada!");
            }
            const estaVinculadoLancamento = yield prisma_1.default.lancamentoBi.findFirst({
                where: {
                    categoria_id: id,
                }
            });
            if (estaVinculadoLancamento && tipo !== categoriaExiste.tipo) {
                throw new Error("Não é possível mudar o TIPO dessa categoria, pois ela está vinculada a um lançamento!");
            }
            const updateCategoria = yield prisma_1.default.categoria.update({
                where: { id },
                data: {
                    name,
                    tipo: estaVinculadoLancamento ? categoriaExiste.tipo : tipo,
                },
                select: {
                    id: true,
                    name: true,
                    tipo: true,
                },
            });
            return updateCategoria;
        });
    }
}
exports.UpdateCategoriaService = UpdateCategoriaService;
