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
exports.ListBiService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListBiService {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bi = yield prisma_1.default.businessIntelligence.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    mes: true,
                    ano: true,
                    status: true,
                    empresa: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    lancamentoBi: {
                        select: {
                            id: true,
                            valor: true,
                            tipo: true,
                            created_at: true,
                            categoria: {
                                select: {
                                    name: true,
                                }
                            },
                            subcategoria: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    },
                }
            });
            if (!bi) {
                throw new Error("BI não encontrado!");
            }
            return bi;
        });
    }
}
exports.ListBiService = ListBiService;
