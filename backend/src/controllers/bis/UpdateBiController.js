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
exports.UpdateBiController = void 0;
const UpdateBiService_1 = require("../../services/bis/UpdateBiService");
class UpdateBiController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { mes, ano, status } = req.body;
            const { usuario_id } = req;
            const updateBiService = new UpdateBiService_1.UpdateBiService();
            try {
                const bi = yield updateBiService.execute({
                    id,
                    mes,
                    ano,
                    status,
                    usuario_id
                });
                return res.json(bi);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateBiController = UpdateBiController;
