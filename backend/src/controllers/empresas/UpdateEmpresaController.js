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
exports.UpdateEmpresaController = void 0;
const UpdateEmpresaService_1 = require("../../services/empresas/UpdateEmpresaService");
class UpdateEmpresaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, cnpj_empresa, email_empresa } = req.body;
            const logo_empresa = req.file ? req.file.filename : null;
            const { usuario_id } = req;
            const updateEmpresaService = new UpdateEmpresaService_1.UpdateEmpresaService();
            try {
                const empresa = yield updateEmpresaService.execute({
                    id,
                    usuario_id,
                    name,
                    cnpj_empresa,
                    logo_empresa,
                    email_empresa
                });
                return res.json(empresa);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateEmpresaController = UpdateEmpresaController;
