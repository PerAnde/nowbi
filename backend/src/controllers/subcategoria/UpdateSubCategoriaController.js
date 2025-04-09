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
exports.UpdateSubCategoriaController = void 0;
const UpdateSubCategoriaService_1 = require("../../services/subcategorias/UpdateSubCategoriaService");
class UpdateSubCategoriaController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name } = req.body;
            const updateSubCategoriaService = new UpdateSubCategoriaService_1.UpdateSubCategoriaService();
            try {
                const subcategoria = yield updateSubCategoriaService.execute({
                    id,
                    name,
                });
                return res.json(subcategoria);
            }
            catch (error) {
                return res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.UpdateSubCategoriaController = UpdateSubCategoriaController;
