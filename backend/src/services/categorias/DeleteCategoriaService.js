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
exports.DeleteCategoriaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteCategoriaService {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se a categoria existe
            const categoria = yield prisma_1.default.categoria.findUnique({
                where: {
                    id: id,
                },
            });
            if (!categoria) {
                throw new Error("Categoria não encontrada!");
            }
            const estaVinculadaLancamento = yield prisma_1.default.lancamentoBi.findFirst({
                where: {
                    categoria_id: id,
                }
            });
            if (estaVinculadaLancamento) {
                throw new Error("Não é possível excluir essa categoria, pois ela está vinculada a um lançamento!");
            }
            yield prisma_1.default.subCategoria.deleteMany({
                where: {
                    categoria_id: id,
                }
            });
            // Remove a categoria
            yield prisma_1.default.categoria.delete({
                where: {
                    id: id,
                },
            });
        });
    }
}
exports.DeleteCategoriaService = DeleteCategoriaService;
