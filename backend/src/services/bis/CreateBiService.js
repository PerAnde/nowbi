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
exports.CreateBiService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateBiService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ mes, ano, id }) {
            if (!['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'].includes(mes)) {
                throw new Error("Selecione um mês válido!");
            }
            if (ano < 2000 || ano > 2050) {
                throw new Error("Selecione um ano entre 2000 e 2050!");
            }
            const biJaExiste = yield prisma_1.default.businessIntelligence.findFirst({
                where: {
                    mes: mes,
                    ano: ano,
                    empresa_id: id,
                }
            });
            if (biJaExiste) {
                throw new Error(`Já existe um BI para ${mes} de ${ano}!`);
            }
            const bi = yield prisma_1.default.businessIntelligence.create({
                data: {
                    mes: mes,
                    ano: ano,
                    empresa_id: id,
                },
                select: {
                    id: true,
                    mes: true,
                    ano: true,
                    empresa_id: true,
                }
            });
            return bi;
        });
    }
}
exports.CreateBiService = CreateBiService;
