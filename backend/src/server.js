"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Config dotenv
require("dotenv/config");
// Importando express
const express_1 = __importDefault(require("express"));
// Importando biblioteca para tratar erros
require("express-async-errors");
// Importando cors
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Importando rotas
const routes_1 = require("./routes/routes");
const app = (0, express_1.default)();
// Tratando dados como JSON
app.use(express_1.default.json());
// Chamando cors para qualquer ip conseguir fazer req
app.use((0, cors_1.default)({
    origin: '*',
}));
// Chamando rotas
app.use(routes_1.router);
app.use('/files', express_1.default.static(path_1.default.resolve(__dirname, '..', 'images')));
app.use((error, req, res, next) => {
    if (error.message) {
        // Se for uma instancia do tipo error
        return res.status(400).json({
            error: error.message
        });
    }
    return res.status(500).json({
        error: 'Erro interno, tente novamente mais tarde!'
    });
});
const port = process.env.PORT;
// Rodando servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`);
});
