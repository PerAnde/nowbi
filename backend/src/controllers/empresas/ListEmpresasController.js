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
exports.ListEmpresasController = void 0;
const ListEmpresasService_1 = require("../../services/empresas/ListEmpresasService");
class ListEmpresasController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario_id } = req;
            const listEmpresaService = new ListEmpresasService_1.ListEmpresasService();
            const empresas = yield listEmpresaService.execute(usuario_id);
            return res.json(empresas);
        });
    }
}
exports.ListEmpresasController = ListEmpresasController;
