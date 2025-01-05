import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {

    //Receber o token
    const authToken = req.headers.authorization;

    //Se nao vier token retorna 401
    if (!authToken) {
        return res.status(401).json({message: "Token inválido!"});
    }

    const [, token] = authToken.split(" ")

    try {

        //Validar token
        const { sub } = verify(
            token,
            process.env.JWT_SECRET
        ) as Payload;

        // Recuperar o id do token e colocar na variavel user_id dentro do req
        req.usuario_id = sub;

        return next();

    } catch (err) {
        return res.status(401).end();
    }

}