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
exports.DeleteLancamentosBiController = void 0;
const DeleteLancamentosBiService_1 = require("../../services/lancamentosBi/DeleteLancamentosBiService");
class DeleteLancamentosBiController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids } = req.body;
                if (!Array.isArray(ids) || ids.length === 0) {
                    return res.status(400).json({ error: "Lançamentos inválidos ou não fornecidos!" });
                }
                const deleteLancamentosService = new DeleteLancamentosBiService_1.DeleteLancamentosBiService();
                yield deleteLancamentosService.execute(ids);
                return res.status(200).json({ message: "Lançamentos excluído com sucesso!" });
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.DeleteLancamentosBiController = DeleteLancamentosBiController;
