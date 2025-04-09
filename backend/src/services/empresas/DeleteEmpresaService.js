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
exports.DeleteEmpresaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteEmpresaService {
    execute(id, usuario_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se a empresa existe
            const empresa = yield prisma_1.default.empresa.findUnique({
                where: {
                    id,
                },
                select: {
                    usuario_id: true,
                }
            });
            if (!empresa) {
                throw new Error("Empresa não encontrada!");
            }
            if (empresa.usuario_id !== usuario_id) {
                throw new Error("Empresa não encontrada!");
            }
            const businessIntelligences = yield prisma_1.default.businessIntelligence.findMany({
                where: {
                    empresa_id: id,
                },
                select: {
                    id: true,
                }
            });
            const biIds = businessIntelligences.map(bi => bi.id);
            if (biIds.length > 0) {
                yield prisma_1.default.lancamentoBi.deleteMany({
                    where: {
                        businessIntelligence_id: {
                            in: biIds,
                        }
                    }
                });
                yield prisma_1.default.businessIntelligence.deleteMany({
                    where: {
                        empresa_id: id,
                    }
                });
            }
            // Remove a empresa
            yield prisma_1.default.empresa.delete({
                where: {
                    id,
                },
            });
        });
    }
}
exports.DeleteEmpresaService = DeleteEmpresaService;
