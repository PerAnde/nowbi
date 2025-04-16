import crypto from 'crypto';
import multer, { FileFilterCallback } from 'multer';
import { extname, resolve } from 'path';
import { Request } from 'express';

export default {
    upload(folder: string) {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    const fullPath = resolve(process.cwd(), folder);
                    cb(null, fullPath);
                },
                filename: (req, file, cb) => {
                    const fileHash = crypto.randomBytes(16).toString("hex");
                    const filename = `${fileHash}-${file.originalname}`;
                    cb(null, filename);
                }
            }),
            limits: {
                fileSize: 3 * 1024 * 1024, // 3MB
            },
            fileFilter: (
                req: Request,
                file: Express.Multer.File,
                cb: FileFilterCallback
            ) => {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Tipo de arquivo inválido. Envie uma imagem JPG, JPEG ou PNG.'));
                }
            }
        };
    }
};
