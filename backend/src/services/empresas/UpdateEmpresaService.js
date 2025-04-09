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
exports.UpdateEmpresaService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateEmpresaService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, usuario_id, name, cnpj_empresa, email_empresa, logo_empresa }) {
            if (!id) {
                throw new Error("Id inválido!");
            }
            if (!name) {
                throw new Error("Informe o nome da empresa!");
            }
            if (!cnpj_empresa) {
                throw new Error("Informe o CNPJ da empresa!");
            }
            if (!email_empresa) {
                throw new Error("Informe o email da empresa!");
            }
            const empresaExiste = yield prisma_1.default.empresa.findUnique({
                where: { id },
                select: {
                    usuario_id: true,
                    logo_empresa: true,
                    email_empresa: true,
                }
            });
            if (!empresaExiste) {
                throw new Error("Empresa não encontrada!");
            }
            if (empresaExiste.usuario_id !== usuario_id) {
                throw new Error("Empresa não encontrada!");
            }
            let logoAtualizada = empresaExiste.logo_empresa;
            if (logo_empresa) {
                // Caminho da pasta onde as logos estão salvas
                const logoPath = path_1.default.resolve(__dirname, '..', '..', '..', 'images');
                // Exclui a logo antiga, se houver
                if (empresaExiste.logo_empresa) {
                    const logoAntigaPath = path_1.default.join(logoPath, empresaExiste.logo_empresa);
                    if (fs_1.default.existsSync(logoAntigaPath)) {
                        fs_1.default.unlinkSync(logoAntigaPath);
                    }
                }
                // Atualiza para a nova logo
                logoAtualizada = logo_empresa;
            }
            const updateEmpresa = yield prisma_1.default.empresa.update({
                where: { id },
                data: {
                    name,
                    cnpj_empresa,
                    logo_empresa: logoAtualizada,
                    email_empresa: email_empresa,
                },
                select: {
                    id: true,
                    name: true,
                    cnpj_empresa: true,
                    logo_empresa: true,
                    email_empresa: true,
                },
            });
            return updateEmpresa;
        });
    }
}
exports.UpdateEmpresaService = UpdateEmpresaService;
