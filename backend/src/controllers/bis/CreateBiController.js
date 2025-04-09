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
exports.CreateBiController = void 0;
const CreateBiService_1 = require("../../services/bis/CreateBiService");
class CreateBiController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { mes, ano } = req.body;
            const createBiService = new CreateBiService_1.CreateBiService();
            const bi = yield createBiService.execute({
                id,
                mes,
                ano,
            });
            return res.json(bi);
        });
    }
}
exports.CreateBiController = CreateBiController;
