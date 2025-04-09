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
exports.ListCategoriaController = void 0;
const ListCategoriaService_1 = require("../../services/categorias/ListCategoriaService");
class ListCategoriaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario_id } = req;
            const { id } = req.params;
            const listCategoriaService = new ListCategoriaService_1.ListCategoriaService();
            const categoria = yield listCategoriaService.execute({
                id,
                usuario_id
            });
            return res.json(categoria);
        });
    }
}
exports.ListCategoriaController = ListCategoriaController;
