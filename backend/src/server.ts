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
import multer from 'multer';

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

// Criando pasta imagens se não existir
const folderPath = path.resolve(process.cwd(), '/home/nowbi/uploads/images');
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// Caminho para salvar imagens
app.use('/files', express.static(path.resolve(process.cwd(), '/home/nowbi/uploads/images')));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Envie uma imagem com no máximo 3MB.' });
        }
    }

    if (err.message === 'Tipo de arquivo inválido. Envie uma imagem JPG, JPEG ou PNG.') {
        return res.status(400).json({ error: err.message });
    }

    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Erro interno, tente novamente mais tarde!' });
});

const port = process.env.PORT

// Rodando servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`)
});