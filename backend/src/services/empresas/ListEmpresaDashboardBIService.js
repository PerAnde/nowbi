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
exports.ListEmpresaDashboardBIService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListEmpresaDashboardBIService {
    execute(link_bi) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield prisma_1.default.empresa.findUnique({
                where: { link_bi },
                select: {
                    id: true,
                    name: true,
                    cnpj_empresa: true,
                    logo_empresa: true,
                    bis: {
                        select: {
                            mes: true,
                            ano: true,
                            status: true,
                            lancamentoBi: {
                                select: {
                                    valor: true,
                                    tipo: true,
                                    categoria: true,
                                    subcategoria: true,
                                }
                            }
                        }
                    },
                }
            });
            if (!empresa) {
                throw new Error("Empresa não encontrada!");
            }
            return empresa;
        });
    }
}
exports.ListEmpresaDashboardBIService = ListEmpresaDashboardBIService;
