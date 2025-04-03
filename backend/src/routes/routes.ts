import { Router } from 'express';
import multer from 'multer';

// Middleware Autenticacao
import { isAuthenticated } from '../middlewares/isAuthenticated';

// Controllers Usuario
import { CreateUsuarioController } from '../controllers/usuario/CreateUsuarioController';
import { AuthUsuarioController } from '../controllers/usuario/AuthUsuarioController';
import { DetailUsuarioController } from '../controllers/usuario/DetailUsuarioController';
import { UpdateUsuarioController } from '../controllers/usuario/UpdateUsuarioController';

// Controllers Grupo Empresas
import { CreateGrupoController } from '../controllers/grupoEmpresas/CreateGrupoController';
import { ListGruposController } from '../controllers/grupoEmpresas/ListGruposController';
import { ListGrupoController } from '../controllers/grupoEmpresas/ListGrupoController';
import { UpdateGrupoController } from '../controllers/grupoEmpresas/UpdateGrupoController';
import { UpdateEmpresasGrupoController } from '../controllers/grupoEmpresas/UpdateEmpresasGrupoController';
import { DeleteGrupoController } from '../controllers/grupoEmpresas/DeleteGrupoController';

// Controllers Empresas
import { CreateEmpresaController } from '../controllers/empresas/CreateEmpresaController';
import { ListEmpresasController } from '../controllers/empresas/ListEmpresasController';
import { ListEmpresaController } from '../controllers/empresas/ListEmpresaController';
import { UpdateEmpresaController } from '../controllers/empresas/UpdateEmpresaController';
import { DeleteEmpresaController } from '../controllers/empresas/DeleteEmpresaController';

// Controllers Categorias
import { CreateCategoriaController } from '../controllers/categorias/CreateCategoriaController';
import { ListCategoriasController } from '../controllers/categorias/ListCategoriasController';
import { ListCategoriaController } from '../controllers/categorias/ListCategoriaController';
import { UpdateCategoriaController } from '../controllers/categorias/UpdateCategoriaController';
import { DeleteCategoriaController } from '../controllers/categorias/DeleteCategoriaController';

// Controllers SubCategorias
import { CreateSubCategoriaController } from '../controllers/subcategoria/CreateSubCategoriaController';
import { UpdateSubCategoriaController } from '../controllers/subcategoria/UpdateSubCategoriaController';
import { DeleteSubCategoriaController } from '../controllers/subcategoria/DeleteSubCategoriaController';

// Controllers BusinessIntelligence
import { CreateBiController } from '../controllers/bis/CreateBiController';
import { ListBiController } from '../controllers/bis/ListBiController';
import { UpdateBiController } from '../controllers/bis/UpdateBiController';
import { UpdateStatusBiController } from '../controllers/bis/UpdateStatusBiController';
import { DeleteBiController } from '../controllers/bis/DeleteBiController';

// Controllers Lancamento BI
import { CreateLancamentoBiController } from '../controllers/lancamentosBi/CreateLancamentoBiController';
import { UpdateLancamentoBiController } from '../controllers/lancamentosBi/UpdateLancamentoBiController';
import { DeleteLancamentoBiController } from '../controllers/lancamentosBi/DeleteLancamentoBiController';
import { DeleteLancamentosBiController } from '../controllers/lancamentosBi/DeleteLancamentosBiController';

// Controller DashboardBi
import { ListEmpresaDashboardBIController } from '../controllers/empresas/ListEmpresaDashboardBIController';

import uploadConfig from '../config/multer'

const router = Router();

const upload = multer(uploadConfig.upload("./images"));

// Rotas Usuario
router.post('/register', new CreateUsuarioController().handle)
router.post('/login', new AuthUsuarioController().handle)
router.get('/user', isAuthenticated, new DetailUsuarioController().handle)
router.put('/user/:id', isAuthenticated, upload.single('file'), new UpdateUsuarioController().handle)

// Rotas Grupo Empresas
router.post('/empresas/grupo', isAuthenticated, new CreateGrupoController().handle)
router.get('/empresas/grupos', isAuthenticated, new ListGruposController().handle)
router.get('/empresas/grupo/:id', isAuthenticated, new ListGrupoController().handle)
router.put('/empresas/grupo/:id', isAuthenticated, new UpdateGrupoController().handle)
router.patch('/empresas/grupo/:id', isAuthenticated, new UpdateEmpresasGrupoController().handle)
router.delete('/empresas/grupo/:id', isAuthenticated, new DeleteGrupoController().handle)

// Rotas Empresas
router.post('/empresas', isAuthenticated, upload.single('file'), new CreateEmpresaController().handle)
router.get('/empresas', isAuthenticated, new ListEmpresasController().handle)
router.get('/empresas/:id', isAuthenticated, new ListEmpresaController().handle)
router.put('/empresas/:id', isAuthenticated, upload.single('file'), new UpdateEmpresaController().handle)
router.delete('/empresas/:id', isAuthenticated, new DeleteEmpresaController().handle)

// Rotas Categorias
router.post('/categorias', isAuthenticated, new CreateCategoriaController().handle)
router.get('/categorias', isAuthenticated, new ListCategoriasController().handle)
router.get('/categorias/:id', isAuthenticated, new ListCategoriaController().handle)
router.put('/categorias/:id', isAuthenticated, new UpdateCategoriaController().handle)
router.delete('/categorias/:id', isAuthenticated, new DeleteCategoriaController().handle)

// Rotas SubCategorias
router.post('/subcategorias', isAuthenticated, new CreateSubCategoriaController().handle)
router.put('/subcategorias/:id', isAuthenticated, new UpdateSubCategoriaController().handle)
router.delete('/subcategorias/:id', isAuthenticated, new DeleteSubCategoriaController().handle)

// Rotas Business Intelligence
router.post('/bi/:id', isAuthenticated, new CreateBiController().handle)
router.get('/bi/:id', isAuthenticated, new ListBiController().handle)
router.put('/bi/:id', isAuthenticated, new UpdateBiController().handle)
router.put('/bi/status/:id', isAuthenticated, new UpdateStatusBiController().handle)
router.delete('/bi/:id', isAuthenticated, new DeleteBiController().handle)

// Rotas Lancamento BI
router.post('/lancamentos/:id', isAuthenticated, new CreateLancamentoBiController().handle)
router.put('/lancamentos/:id', isAuthenticated, new UpdateLancamentoBiController().handle)
router.delete('/lancamentos/:id', isAuthenticated, new DeleteLancamentoBiController().handle)
router.delete('/lancamentos', isAuthenticated, new DeleteLancamentosBiController().handle)

// Rotas Dashboard BI
router.get('/dashboardbi/:link_bi', new ListEmpresaDashboardBIController().handle)

export { router };