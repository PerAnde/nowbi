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
exports.ListEmpresaController = void 0;
const ListEmpresaService_1 = require("../../services/empresas/ListEmpresaService");
class ListEmpresaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { usuario_id } = req;
            const listarEmpresaService = new ListEmpresaService_1.ListEmpresaService();
            const empresa = yield listarEmpresaService.execute(id, usuario_id);
            return res.json(empresa);
        });
    }
}
exports.ListEmpresaController = ListEmpresaController;
