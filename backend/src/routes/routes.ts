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

// Controllers Categorias
import { CreateCategoriaController } from '../controllers/categorias/CreateCategoriaController';
import { ListCategoriasController } from '../controllers/categorias/ListCategoriasController';

// Controllers SubCategorias
import { CreateSubCategoriaController } from '../controllers/subcategoria/CreateSubCategoriaController';

import uploadConfig from '../config/multer'

const router = Router();

const upload = multer(uploadConfig.upload("./images"));

// Rotas Usuario
router.post('/register', new CreateUsuarioController().handle)
router.post('/login', new AuthUsuarioController().handle)
router.get('/user', isAuthenticated, new DetailUsuarioController().handle)
router.put('/user/:id', isAuthenticated, new UpdateUsuarioController().handle)

// Rotas Empresas
router.post('/empresas', isAuthenticated, upload.single('file'), new CreateEmpresaController().handle)
router.get('/empresas', isAuthenticated, new ListEmpresasController().handle)
router.get('/empresas/:id', isAuthenticated, new ListEmpresaController().handle)
router.put('/empresas/:id', isAuthenticated, upload.single('file'), new UpdateEmpresaController().handle)
router.delete('/empresas/:id', isAuthenticated, new DeleteEmpresaController().handle)

// Rotas Categorias
router.post('/categorias', isAuthenticated, new CreateCategoriaController().handle)
router.get('/categorias', isAuthenticated, new ListCategoriasController().handle)

// Rotas SubCategorias
router.post('/subcategorias', isAuthenticated, new CreateSubCategoriaController().handle)

export { router };