import crypto from 'crypto';
import multer from "multer";

import { extname, resolve } from 'path';

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
            })
        };
    }
}