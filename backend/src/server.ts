// Config dotenv
import 'dotenv/config';
// Importando express
import express, { Request, Response, NextFunction } from 'express';
// Importando biblioteca para tratar erros
import 'express-async-errors'
// Importando cors
import cors from 'cors';

import fs from 'fs';
import path from 'path';

// Importando rotas
import { router } from './routes/routes';

const app = express();
// Tratando dados como JSON
app.use(express.json());
// Chamando cors para qualquer ip conseguir fazer req
app.use('/files', cors({ origin: '*' }));
app.use(cors({
    origin: '*',
}));

// Chamando rotas
app.use(router);

// Criando pasta imagens
// const folderPath = path.resolve(process.cwd(), 'images');
// if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath);
// }

// Caminho para salvar imagens
app.use('/files', express.static(path.resolve(__dirname, 'images')));

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error.message) {
        // Se for uma instancia do tipo error
        return res.status(400).json({
            error: error.message
        })
    }

    return res.status(500).json({
        error: 'Erro interno, tente novamente mais tarde!'
    })

});

const port = process.env.PORT

// Rodando servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`)
});