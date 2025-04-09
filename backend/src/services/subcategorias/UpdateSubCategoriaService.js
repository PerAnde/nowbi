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
exports.UpdateSubCategoriaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateSubCategoriaService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name }) {
            if (!id || !name) {
                throw new Error("Id ou nome inválido!");
            }
            const subCategoriaExiste = yield prisma_1.default.subCategoria.findUnique({
                where: { id },
            });
            if (!subCategoriaExiste) {
                throw new Error("Subcategoria não encontrada!");
            }
            const updateSubCategoria = yield prisma_1.default.subCategoria.update({
                where: { id },
                data: {
                    name,
                },
                select: {
                    id: true,
                    name: true,
                },
            });
            return updateSubCategoria;
        });
    }
}
exports.UpdateSubCategoriaService = UpdateSubCategoriaService;
