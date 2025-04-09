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
exports.CreateGrupoController = void 0;
const CreateGrupoService_1 = require("../../services/grupoEmpresas/CreateGrupoService");
class CreateGrupoController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email_grupo } = req.body;
            const usuario_id = req.usuario_id;
            const createGrupoEmpresasService = new CreateGrupoService_1.CreateGrupoEmpresasService();
            const grupoEmpresa = yield createGrupoEmpresasService.execute({
                name,
                email_grupo,
                usuario_id
            });
            return res.json(grupoEmpresa);
        });
    }
}
exports.CreateGrupoController = CreateGrupoController;
