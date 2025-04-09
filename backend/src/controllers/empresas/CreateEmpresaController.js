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
exports.CreateEmpresaController = void 0;
const CreateEmpresaService_1 = require("../../services/empresas/CreateEmpresaService");
class CreateEmpresaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, cnpj_empresa, email_empresa } = req.body;
            const usuario_id = req.usuario_id;
            // Caso esteja enviando imagem, lidando com ela
            const logo_empresa = req.file ? req.file.filename : null;
            const createEmpresaService = new CreateEmpresaService_1.CreateEmpresaService();
            // const { originalname, filename: logo_empresa } = req.file;
            const empresa = yield createEmpresaService.execute({
                name,
                cnpj_empresa,
                logo_empresa,
                email_empresa,
                usuario_id
            });
            return res.json(empresa);
        });
    }
}
exports.CreateEmpresaController = CreateEmpresaController;
