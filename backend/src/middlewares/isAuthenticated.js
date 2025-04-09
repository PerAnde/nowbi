"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
    //Receber o token
    const authToken = req.headers.authorization;
    //Se nao vier token retorna 401
    if (!authToken) {
        return res.status(401).json({ message: "Token inválido!" });
    }
    const [, token] = authToken.split(" ");
    try {
        //Validar token
        const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        // Recuperar o id do token e colocar na variavel user_id dentro do req
        req.usuario_id = sub;
        return next();
    }
    catch (err) {
        return res.status(401).end();
    }
}
