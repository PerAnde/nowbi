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
exports.CreateCategoriaController = void 0;
const CreateCategoriaService_1 = require("../../services/categorias/CreateCategoriaService");
class CreateCategoriaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, tipo } = req.body;
            const usuario_id = req.usuario_id;
            const createCategoriaService = new CreateCategoriaService_1.CreateCategoriaService();
            const categoria = yield createCategoriaService.execute({
                name,
                tipo,
                usuario_id
            });
            return res.json(categoria);
        });
    }
}
exports.CreateCategoriaController = CreateCategoriaController;
