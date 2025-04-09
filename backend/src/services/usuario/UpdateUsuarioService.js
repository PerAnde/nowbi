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
exports.UpdateUsuarioService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateUsuarioService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, name, cep, endereco, numero, bairro, cidade, ibge, estado, telefone, img_usuario }) {
            if (!id) {
                throw new Error("Id inválido!");
            }
            if (!name) {
                throw new Error("Insira seu nome ou razão social!");
            }
            const usuarioExiste = yield prisma_1.default.usuario.findUnique({
                where: { id },
            });
            if (!usuarioExiste) {
                throw new Error("Usuário não encontrado!");
            }
            let imgUsuarioAtualizada = usuarioExiste.img_usuario;
            if (img_usuario) {
                // Caminho da pasta onde as logos estão salvas
                const logoPath = path_1.default.resolve(__dirname, '..', '..', '..', 'images');
                // Exclui a logo antiga, se houver
                if (usuarioExiste.img_usuario) {
                    const logoAntigaPath = path_1.default.join(logoPath, usuarioExiste.img_usuario);
                    if (fs_1.default.existsSync(logoAntigaPath)) {
                        fs_1.default.unlinkSync(logoAntigaPath);
                    }
                }
                // Atualiza para a nova logo
                imgUsuarioAtualizada = img_usuario;
            }
            const updateUsuario = yield prisma_1.default.usuario.update({
                where: { id },
                data: {
                    name,
                    cep,
                    endereco,
                    numero,
                    bairro,
                    cidade,
                    ibge,
                    estado,
                    telefone,
                    img_usuario: imgUsuarioAtualizada,
                },
                select: {
                    id: true,
                    name: true,
                    cep: true,
                    endereco: true,
                    numero: true,
                    bairro: true,
                    cidade: true,
                    ibge: true,
                    estado: true,
                    telefone: true,
                    img_usuario: true,
                }
            });
            return updateUsuario;
        });
    }
}
exports.UpdateUsuarioService = UpdateUsuarioService;
