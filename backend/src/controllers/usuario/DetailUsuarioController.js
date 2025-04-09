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
exports.DetailUsuarioController = void 0;
const DetailUsuarioService_1 = require("../../services/usuario/DetailUsuarioService");
class DetailUsuarioController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario_id = req.usuario_id;
            const detailUsuarioService = new DetailUsuarioService_1.DetailUsuarioService();
            const usuario = yield detailUsuarioService.execute(usuario_id);
            return res.json(usuario);
        });
    }
}
exports.DetailUsuarioController = DetailUsuarioController;
