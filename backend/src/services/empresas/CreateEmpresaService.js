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
exports.CreateEmpresaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const crypto_1 = __importDefault(require("crypto"));
class CreateEmpresaService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, cnpj_empresa, logo_empresa, email_empresa, usuario_id }) {
            if (!name || !usuario_id) {
                throw new Error("Nome ou ID inválido!");
            }
            if (!cnpj_empresa) {
                throw new Error("Insira o CNPJ da empresa!");
            }
            if (!email_empresa) {
                throw new Error("Insira o email da empresa!");
            }
            const link_bi = crypto_1.default.randomBytes(20).toString("hex");
            const empresa = yield prisma_1.default.empresa.create({
                data: {
                    name: name,
                    cnpj_empresa: cnpj_empresa,
                    logo_empresa: logo_empresa,
                    email_empresa: email_empresa,
                    usuario_id: usuario_id,
                    link_bi: link_bi,
                },
                select: {
                    id: true,
                    name: true,
                    cnpj_empresa: true,
                    logo_empresa: true,
                    email_empresa: true,
                    usuario_id: true,
                    link_bi: true,
                }
            });
            return empresa;
        });
    }
}
exports.CreateEmpresaService = CreateEmpresaService;
