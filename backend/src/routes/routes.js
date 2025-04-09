"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
// Middleware Autenticacao
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
// Controllers Usuario
const CreateUsuarioController_1 = require("../controllers/usuario/CreateUsuarioController");
const AuthUsuarioController_1 = require("../controllers/usuario/AuthUsuarioController");
const DetailUsuarioController_1 = require("../controllers/usuario/DetailUsuarioController");
const UpdateUsuarioController_1 = require("../controllers/usuario/UpdateUsuarioController");
// Controllers Grupo Empresas
const CreateGrupoController_1 = require("../controllers/grupoEmpresas/CreateGrupoController");
const ListGruposController_1 = require("../controllers/grupoEmpresas/ListGruposController");
const ListGrupoController_1 = require("../controllers/grupoEmpresas/ListGrupoController");
const UpdateGrupoController_1 = require("../controllers/grupoEmpresas/UpdateGrupoController");
const UpdateEmpresasGrupoController_1 = require("../controllers/grupoEmpresas/UpdateEmpresasGrupoController");
const DeleteGrupoController_1 = require("../controllers/grupoEmpresas/DeleteGrupoController");
// Controllers Empresas
const CreateEmpresaController_1 = require("../controllers/empresas/CreateEmpresaController");
const ListEmpresasController_1 = require("../controllers/empresas/ListEmpresasController");
const ListEmpresaController_1 = require("../controllers/empresas/ListEmpresaController");
const UpdateEmpresaController_1 = require("../controllers/empresas/UpdateEmpresaController");
const DeleteEmpresaController_1 = require("../controllers/empresas/DeleteEmpresaController");
// Controllers Categorias
const CreateCategoriaController_1 = require("../controllers/categorias/CreateCategoriaController");
const ListCategoriasController_1 = require("../controllers/categorias/ListCategoriasController");
const ListCategoriaController_1 = require("../controllers/categorias/ListCategoriaController");
const UpdateCategoriaController_1 = require("../controllers/categorias/UpdateCategoriaController");
const DeleteCategoriaController_1 = require("../controllers/categorias/DeleteCategoriaController");
// Controllers SubCategorias
const CreateSubCategoriaController_1 = require("../controllers/subcategoria/CreateSubCategoriaController");
const UpdateSubCategoriaController_1 = require("../controllers/subcategoria/UpdateSubCategoriaController");
const DeleteSubCategoriaController_1 = require("../controllers/subcategoria/DeleteSubCategoriaController");
// Controllers BusinessIntelligence
const CreateBiController_1 = require("../controllers/bis/CreateBiController");
const ListBiController_1 = require("../controllers/bis/ListBiController");
const UpdateBiController_1 = require("../controllers/bis/UpdateBiController");
const UpdateStatusBiController_1 = require("../controllers/bis/UpdateStatusBiController");
const DeleteBiController_1 = require("../controllers/bis/DeleteBiController");
// Controllers Lancamento BI
const CreateLancamentoBiController_1 = require("../controllers/lancamentosBi/CreateLancamentoBiController");
const UpdateLancamentoBiController_1 = require("../controllers/lancamentosBi/UpdateLancamentoBiController");
const DeleteLancamentoBiController_1 = require("../controllers/lancamentosBi/DeleteLancamentoBiController");
const DeleteLancamentosBiController_1 = require("../controllers/lancamentosBi/DeleteLancamentosBiController");
// Controller DashboardBi
const ListEmpresaDashboardBIController_1 = require("../controllers/empresas/ListEmpresaDashboardBIController");
const multer_2 = __importDefault(require("../config/multer"));
const router = (0, express_1.Router)();
exports.router = router;
const upload = (0, multer_1.default)(multer_2.default.upload("./images"));
// Rotas Usuario
router.post('/register', new CreateUsuarioController_1.CreateUsuarioController().handle);
router.post('/login', new AuthUsuarioController_1.AuthUsuarioController().handle);
router.get('/user', isAuthenticated_1.isAuthenticated, new DetailUsuarioController_1.DetailUsuarioController().handle);
router.put('/user/:id', isAuthenticated_1.isAuthenticated, upload.single('file'), new UpdateUsuarioController_1.UpdateUsuarioController().handle);
// Rotas Grupo Empresas
router.post('/empresas/grupo', isAuthenticated_1.isAuthenticated, new CreateGrupoController_1.CreateGrupoController().handle);
router.get('/empresas/grupos', isAuthenticated_1.isAuthenticated, new ListGruposController_1.ListGruposController().handle);
router.get('/empresas/grupo/:id', isAuthenticated_1.isAuthenticated, new ListGrupoController_1.ListGrupoController().handle);
router.put('/empresas/grupo/:id', isAuthenticated_1.isAuthenticated, new UpdateGrupoController_1.UpdateGrupoController().handle);
router.patch('/empresas/grupo/:id', isAuthenticated_1.isAuthenticated, new UpdateEmpresasGrupoController_1.UpdateEmpresasGrupoController().handle);
router.delete('/empresas/grupo/:id', isAuthenticated_1.isAuthenticated, new DeleteGrupoController_1.DeleteGrupoController().handle);
// Rotas Empresas
router.post('/empresas', isAuthenticated_1.isAuthenticated, upload.single('file'), new CreateEmpresaController_1.CreateEmpresaController().handle);
router.get('/empresas', isAuthenticated_1.isAuthenticated, new ListEmpresasController_1.ListEmpresasController().handle);
router.get('/empresas/:id', isAuthenticated_1.isAuthenticated, new ListEmpresaController_1.ListEmpresaController().handle);
router.put('/empresas/:id', isAuthenticated_1.isAuthenticated, upload.single('file'), new UpdateEmpresaController_1.UpdateEmpresaController().handle);
router.delete('/empresas/:id', isAuthenticated_1.isAuthenticated, new DeleteEmpresaController_1.DeleteEmpresaController().handle);
// Rotas Categorias
router.post('/categorias', isAuthenticated_1.isAuthenticated, new CreateCategoriaController_1.CreateCategoriaController().handle);
router.get('/categorias', isAuthenticated_1.isAuthenticated, new ListCategoriasController_1.ListCategoriasController().handle);
router.get('/categorias/:id', isAuthenticated_1.isAuthenticated, new ListCategoriaController_1.ListCategoriaController().handle);
router.put('/categorias/:id', isAuthenticated_1.isAuthenticated, new UpdateCategoriaController_1.UpdateCategoriaController().handle);
router.delete('/categorias/:id', isAuthenticated_1.isAuthenticated, new DeleteCategoriaController_1.DeleteCategoriaController().handle);
// Rotas SubCategorias
router.post('/subcategorias', isAuthenticated_1.isAuthenticated, new CreateSubCategoriaController_1.CreateSubCategoriaController().handle);
router.put('/subcategorias/:id', isAuthenticated_1.isAuthenticated, new UpdateSubCategoriaController_1.UpdateSubCategoriaController().handle);
router.delete('/subcategorias/:id', isAuthenticated_1.isAuthenticated, new DeleteSubCategoriaController_1.DeleteSubCategoriaController().handle);
// Rotas Business Intelligence
router.post('/bi/:id', isAuthenticated_1.isAuthenticated, new CreateBiController_1.CreateBiController().handle);
router.get('/bi/:id', isAuthenticated_1.isAuthenticated, new ListBiController_1.ListBiController().handle);
router.put('/bi/:id', isAuthenticated_1.isAuthenticated, new UpdateBiController_1.UpdateBiController().handle);
router.put('/bi/status/:id', isAuthenticated_1.isAuthenticated, new UpdateStatusBiController_1.UpdateStatusBiController().handle);
router.delete('/bi/:id', isAuthenticated_1.isAuthenticated, new DeleteBiController_1.DeleteBiController().handle);
// Rotas Lancamento BI
router.post('/lancamentos/:id', isAuthenticated_1.isAuthenticated, new CreateLancamentoBiController_1.CreateLancamentoBiController().handle);
router.put('/lancamentos/:id', isAuthenticated_1.isAuthenticated, new UpdateLancamentoBiController_1.UpdateLancamentoBiController().handle);
router.delete('/lancamentos/:id', isAuthenticated_1.isAuthenticated, new DeleteLancamentoBiController_1.DeleteLancamentoBiController().handle);
router.delete('/lancamentos', isAuthenticated_1.isAuthenticated, new DeleteLancamentosBiController_1.DeleteLancamentosBiController().handle);
// Rotas Dashboard BI
router.get('/dashboardbi/:link_bi', new ListEmpresaDashboardBIController_1.ListEmpresaDashboardBIController().handle);
