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
exports.UpdateStatusBiService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateStatusBiService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, status, usuario_id }) {
            if (!id) {
                throw new Error("Id inválido!");
            }
            // Verifica se o ID do BI existe
            const biExiste = yield prisma_1.default.businessIntelligence.findUnique({
                where: { id },
                include: {
                    empresa: true,
                }
            });
            if (!biExiste) {
                throw new Error("BI não encontrado!");
            }
            if (biExiste.empresa.usuario_id !== usuario_id) {
                throw new Error("BI não encontrado!");
            }
            const updateStatusBi = yield prisma_1.default.businessIntelligence.update({
                where: { id },
                data: {
                    status
                },
                select: {
                    id: true,
                    status: true,
                }
            });
            return updateStatusBi;
        });
    }
}
exports.UpdateStatusBiService = UpdateStatusBiService;
