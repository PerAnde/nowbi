import { Router } from 'express';
import multer from 'multer';

// Middleware Autenticacao
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { verificaStatusConta } from '../middlewares/verificaStatusConta';
import { limitaRecursosDuranteTeste } from '../middlewares/limitaRecursosDuranteTeste';

// Controllers Usuario
import { CreateUsuarioController } from '../controllers/usuario/CreateUsuarioController';
import { AuthUsuarioController } from '../controllers/usuario/AuthUsuarioController';
import { DetailUsuarioController } from '../controllers/usuario/DetailUsuarioController';
import { UpdateUsuarioController } from '../controllers/usuario/UpdateUsuarioController';

// Controllers Planos e Teste
import { ListPlanosController } from '../controllers/planos/planosController';

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
import { ListLancamentoBIController } from '../controllers/lancamentosBi/ListLancamentoBIController';
import { UpdateLancamentoBiController } from '../controllers/lancamentosBi/UpdateLancamentoBiController';
import { DeleteLancamentoBiController } from '../controllers/lancamentosBi/DeleteLancamentoBiController';
import { DeleteLancamentosBiController } from '../controllers/lancamentosBi/DeleteLancamentosBiController';

// Controller DashboardBi
import { ListEmpresaDashboardBIController } from '../controllers/empresas/ListEmpresaDashboardBIController';

import uploadConfig from '../config/multer'

const router = Router();

const upload = multer(uploadConfig.upload("images"));

// Rotas Usuario
router.post('/register', new CreateUsuarioController().handle)
router.post('/login', new AuthUsuarioController().handle)
router.get('/user', isAuthenticated, verificaStatusConta, new DetailUsuarioController().handle)
router.put('/user/:id', isAuthenticated, verificaStatusConta, upload.single('file'), new UpdateUsuarioController().handle)
router.get('/planos', isAuthenticated, verificaStatusConta, new ListPlanosController().handle)

// Rotas Grupo Empresas
router.post('/empresas/grupo', isAuthenticated, verificaStatusConta, new CreateGrupoController().handle)
router.get('/empresas/grupos', isAuthenticated, verificaStatusConta, new ListGruposController().handle)
router.get('/empresas/grupo/:id', isAuthenticated, verificaStatusConta, new ListGrupoController().handle)
router.put('/empresas/grupo/:id', isAuthenticated, verificaStatusConta, new UpdateGrupoController().handle)
router.patch('/empresas/grupo/:id', isAuthenticated, verificaStatusConta, new UpdateEmpresasGrupoController().handle)
router.delete('/empresas/grupo/:id', isAuthenticated, verificaStatusConta, new DeleteGrupoController().handle)

// Rotas Empresas
router.post('/empresas', isAuthenticated, verificaStatusConta, limitaRecursosDuranteTeste, upload.single('file'), new CreateEmpresaController().handle)
router.get('/empresas', isAuthenticated, verificaStatusConta, new ListEmpresasController().handle)
router.get('/empresas/:id', isAuthenticated, verificaStatusConta, new ListEmpresaController().handle)
router.put('/empresas/:id', isAuthenticated, verificaStatusConta, upload.single('file'), new UpdateEmpresaController().handle)
router.delete('/empresas/:id', isAuthenticated, verificaStatusConta, new DeleteEmpresaController().handle)

// Rotas Categorias
router.post('/categorias', isAuthenticated, verificaStatusConta, new CreateCategoriaController().handle)
router.get('/categorias', isAuthenticated, verificaStatusConta, new ListCategoriasController().handle)
router.get('/categorias/:id', isAuthenticated, verificaStatusConta, new ListCategoriaController().handle)
router.put('/categorias/:id', isAuthenticated, verificaStatusConta, new UpdateCategoriaController().handle)
router.delete('/categorias/:id', isAuthenticated, verificaStatusConta, new DeleteCategoriaController().handle)

// Rotas SubCategorias
router.post('/subcategorias', isAuthenticated, verificaStatusConta, new CreateSubCategoriaController().handle)
router.put('/subcategorias/:id', isAuthenticated, verificaStatusConta, new UpdateSubCategoriaController().handle)
router.delete('/subcategorias/:id', isAuthenticated, verificaStatusConta, new DeleteSubCategoriaController().handle)

// Rotas Business Intelligence
router.post('/bi/:id', isAuthenticated, verificaStatusConta, new CreateBiController().handle)
router.get('/bi/:id', isAuthenticated, verificaStatusConta, new ListBiController().handle)
router.put('/bi/:id', isAuthenticated, verificaStatusConta, new UpdateBiController().handle)
router.put('/bi/status/:id', isAuthenticated, verificaStatusConta, new UpdateStatusBiController().handle)
router.delete('/bi/:id', isAuthenticated, verificaStatusConta, new DeleteBiController().handle)

// Rotas Lancamento BI
router.post('/lancamentos/:id', isAuthenticated, verificaStatusConta, new CreateLancamentoBiController().handle)
router.get('/lancamentos/:id', isAuthenticated, verificaStatusConta, new ListLancamentoBIController().handle)
router.put('/lancamentos/:id', isAuthenticated, verificaStatusConta, new UpdateLancamentoBiController().handle)
router.delete('/lancamentos/:id', isAuthenticated, verificaStatusConta, new DeleteLancamentoBiController().handle)
router.delete('/lancamentos', isAuthenticated, verificaStatusConta, new DeleteLancamentosBiController().handle)

// Rotas Dashboard BI
router.get('/dashboardbi/:link_bi', new ListEmpresaDashboardBIController().handle)

export { router };