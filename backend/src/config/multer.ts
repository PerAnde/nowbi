import crypto from 'crypto';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import { extname, resolve } from 'path';
import { Request } from 'express';

export default {
    upload(folder: string, allowedTypes: string[], allowedExtensions: string[]) {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    const fullPath = resolve(process.cwd(), folder);

                    if (!fs.existsSync(fullPath)) {
                        fs.mkdirSync(fullPath, { recursive: true });
                    }

                    cb(null, fullPath);
                },
                filename: (req, file, cb) => {
                    const fileHash = crypto.randomBytes(16).toString("hex");
                    const filename = `${fileHash}-${file.originalname}`;
                    cb(null, filename);
                }
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 3MB
            },
            fileFilter: (
                req: Request,
                file: Express.Multer.File,
                cb: FileFilterCallback
            ) => {
                const fileExtension = extname(file.originalname).toLowerCase();
                const isMimeAllowed = allowedTypes.includes(file.mimetype);
                const isExtensionAllowed = allowedExtensions.includes(fileExtension);

                if (isMimeAllowed && isExtensionAllowed) {
                    return cb(null, true);
                }

                return cb(new Error('Tipo de arquivo inválido.'));
            }
        };
    }
};
