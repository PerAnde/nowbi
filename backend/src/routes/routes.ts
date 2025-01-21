import { Router } from 'express';
import multer from 'multer';

// Middleware Autenticacao
import { isAuthenticated } from '../middlewares/isAuthenticated';

// Controllers Usuario
import { CreateUsuarioController } from '../controllers/usuario/CreateUsuarioController';
import { AuthUsuarioController } from '../controllers/usuario/AuthUsuarioController';
import { DetailUsuarioController } from '../controllers/usuario/DetailUsuarioController';
import { UpdateUsuarioController } from '../controllers/usuario/UpdateUsuarioController';

// Controllers Empresas
import { CreateEmpresaController } from '../controllers/empresas/CreateEmpresaController';
import { ListEmpresasController } from '../controllers/empresas/ListEmpresasController';
import { ListEmpresaController } from '../controllers/empresas/ListEmpresaController';
import { UpdateEmpresaController } from '../controllers/empresas/UpdateEmpresaController';
import { DeleteEmpresaController } from '../controllers/empresas/DeleteEmpresaController';

import uploadConfig from '../config/multer'

const router = Router();

const upload = multer(uploadConfig.upload("./images"));

// Rotas Usuario
router.post('/register', new CreateUsuarioController().handle)
router.post('/login', new AuthUsuarioController().handle)
router.get('/user', isAuthenticated, new DetailUsuarioController().handle)
router.put('/user/:id', isAuthenticated, new UpdateUsuarioController().handle)

// Rotas Cliente
router.post('/empresas', isAuthenticated, upload.single('file'), new CreateEmpresaController().handle)
router.get('/empresas', isAuthenticated, new ListEmpresasController().handle)
router.get('/empresas/:id', isAuthenticated, new ListEmpresaController().handle)
router.put('/empresas/:id', isAuthenticated, upload.single('file'), new UpdateEmpresaController().handle)
router.delete('/empresas/:id', isAuthenticated, new DeleteEmpresaController().handle)

export { router };