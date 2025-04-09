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
exports.UpdateEmpresasGrupoController = void 0;
const UpdateEmpresasGrupoService_1 = require("../../services/grupoEmpresas/UpdateEmpresasGrupoService");
class UpdateEmpresasGrupoController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { empresa_id, acao } = req.body;
            const updateEmpresasGrupoService = new UpdateEmpresasGrupoService_1.UpdateEmpresasGrupoService();
            try {
                const grupoAtualizado = yield updateEmpresasGrupoService.execute({
                    id,
                    empresa_id,
                    acao
                });
                return res.json(grupoAtualizado);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateEmpresasGrupoController = UpdateEmpresasGrupoController;
