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
exports.UpdateStatusBiController = void 0;
const UpdateStatusBiService_1 = require("../../services/bis/UpdateStatusBiService");
class UpdateStatusBiController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            const { usuario_id } = req;
            const updateStatusBiService = new UpdateStatusBiService_1.UpdateStatusBiService();
            try {
                const bi = yield updateStatusBiService.execute({
                    id,
                    status,
                    usuario_id,
                });
                return res.json(bi);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateStatusBiController = UpdateStatusBiController;
