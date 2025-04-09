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
exports.CreateGrupoEmpresasService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateGrupoEmpresasService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email_grupo, usuario_id }) {
            if (!name || !email_grupo || !usuario_id) {
                throw new Error("Dados inválidos!");
            }
            const emailGrupoJaExiste = yield prisma_1.default.grupoEmpresa.findFirst({
                where: {
                    email_grupo: email_grupo,
                }
            });
            if (emailGrupoJaExiste) {
                throw new Error("Este e-mail já está em uso por um grupo ou empresa.");
            }
            const grupoEmpresa = yield prisma_1.default.grupoEmpresa.create({
                data: {
                    name: name,
                    email_grupo: email_grupo,
                    usuario_id: usuario_id
                },
                select: {
                    id: true,
                    name: true,
                    email_grupo: true,
                    usuario_id: true,
                }
            });
            return grupoEmpresa;
        });
    }
}
exports.CreateGrupoEmpresasService = CreateGrupoEmpresasService;
