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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUsuarioController = void 0;
const UpdateUsuarioService_1 = require("../../services/usuario/UpdateUsuarioService");
class UpdateUsuarioController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, cep, endereco, numero, bairro, cidade, ibge, estado, telefone } = req.body;
            const img_usuario = req.file ? req.file.filename : null;
            const updateUsuarioService = new UpdateUsuarioService_1.UpdateUsuarioService();
            try {
                const usuario = yield updateUsuarioService.execute({
                    id,
                    name,
                    cep,
                    endereco,
                    numero,
                    bairro,
                    cidade,
                    ibge,
                    estado,
                    telefone,
                    img_usuario,
                });
                return res.json(usuario);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateUsuarioController = UpdateUsuarioController;
