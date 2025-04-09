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
exports.DeleteLancamentoBiController = void 0;
const DeleteLancamentoBiService_1 = require("../../services/lancamentosBi/DeleteLancamentoBiService");
class DeleteLancamentoBiController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleteLancamentoService = new DeleteLancamentoBiService_1.DeleteLancamentoBiService();
                yield deleteLancamentoService.execute(id);
                return res.status(200).json({ message: "Lançamento excluído com sucesso!" });
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.DeleteLancamentoBiController = DeleteLancamentoBiController;
