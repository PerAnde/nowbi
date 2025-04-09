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
exports.CreateLancamentoBiService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateLancamentoBiService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ valor, tipo, categoria, subcategoria, id }) {
            if (!valor) {
                throw new Error("Valor inválido!");
            }
            if (!['RECEITA', 'DESPESA'].includes(tipo)) {
                throw new Error("Tipo inválido!");
            }
            if (!categoria) {
                throw new Error("Categoria inválida!");
            }
            if (!id) {
                throw new Error("BI inválido!");
            }
            const data = {
                valor: valor,
                tipo: tipo,
                categoria_id: categoria,
                businessIntelligence_id: id,
            };
            if (subcategoria) {
                data.subcategoria_id = subcategoria;
            }
            const lancamento = yield prisma_1.default.lancamentoBi.create({
                data,
                select: {
                    id: true,
                    valor: true,
                    tipo: true,
                    categoria_id: true,
                    subcategoria_id: true,
                    businessIntelligence_id: true,
                }
            });
            return lancamento;
        });
    }
}
exports.CreateLancamentoBiService = CreateLancamentoBiService;
