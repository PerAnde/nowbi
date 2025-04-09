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
exports.DeleteGrupoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteGrupoService {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se a subcategoria existe
            const grupoEmpresa = yield prisma_1.default.grupoEmpresa.findUnique({
                where: {
                    id: id,
                },
            });
            if (!grupoEmpresa) {
                throw new Error("Grupo não encontrado!");
            }
            // Remove a subcategoria
            yield prisma_1.default.grupoEmpresa.delete({
                where: {
                    id: id,
                },
            });
        });
    }
}
exports.DeleteGrupoService = DeleteGrupoService;
