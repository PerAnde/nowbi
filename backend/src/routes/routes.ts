import { Router } from 'express';
import multer from 'multer';

// Middleware Autenticacao
import { isAuthenticated } from '../middlewares/isAuthenticated';

// Controllers Usuario
import { CreateUserController } from '../controllers/user/CreateUserController';
import { AuthUserController } from '../controllers/user/AuthUserController';
import { DetailUserController } from '../controllers/user/DetailUserController';

// Controllers Clientes
import { CreateClientController } from '../controllers/clients/CreateClientController';
import { ListClientController } from '../controllers/clients/ListClientController';

import uploadConfig from '../config/multer'

const router = Router();

const upload = multer(uploadConfig.upload("./images"));

// Rotas Usuario
router.post('/register', new CreateUserController().handle)
router.post('/login', new AuthUserController().handle)
router.get('/user', isAuthenticated, new DetailUserController().handle)

// Rotas Cliente
router.post('/clients', isAuthenticated, upload.single('file'), new CreateClientController().handle)
router.get('/clients', isAuthenticated, new ListClientController().handle)

export { router };