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
exports.ListCategoriaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListCategoriaService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, usuario_id }) {
            const where = { usuario_id };
            const categoria = yield prisma_1.default.categoria.findMany({
                where: {
                    id: id,
                    usuario_id: usuario_id,
                },
                select: {
                    id: true,
                    name: true,
                    tipo: true,
                    subcategorias: true,
                }
            });
            if (!categoria) {
                throw new Error("Categoria não encontrada!");
            }
            return categoria;
        });
    }
}
exports.ListCategoriaService = ListCategoriaService;
