"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategoriasNovoUsuarioService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateCategoriasNovoUsuarioService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ usuario_id }) {
            yield prisma_1.default.categoria.createMany({
                data: [
                    // Receitas
                    { name: "Aporte de Sócios", tipo: "RECEITA", usuario_id: usuario_id },
                    { name: "Receitas Adicionais em Operações Financeiras", tipo: "RECEITA", usuario_id: usuario_id },
                    { name: "Rendimento Aplicações", tipo: "RECEITA", usuario_id: usuario_id },
                    { name: "Vendas de Mercadoria", tipo: "RECEITA", usuario_id: usuario_id },
                    // Despesas
                    { name: "Custos de Produtos", tipo: "DESPESA", usuario_id: usuario_id },
                    { name: "Despesas Adicionais em Operações Financeiras", tipo: "DESPESA", usuario_id: usuario_id },
                    { name: "Despesas Administrativas", tipo: "DESPESA", usuario_id: usuario_id },
                    { name: "Despesas Comerciais", tipo: "DESPESA", usuario_id: usuario_id },
                    { name: "Despesas Marketing", tipo: "DESPESA", usuario_id: usuario_id },
                    { name: "Impostos", tipo: "DESPESA", usuario_id: usuario_id },
                    { name: "Investimentos", tipo: "DESPESA", usuario_id: usuario_id },
                    { name: "Retirada Sócios", tipo: "DESPESA", usuario_id: usuario_id },
                ]
            });
            const categorias = yield prisma_1.default.categoria.findMany({
                where: { usuario_id },
                select: { id: true, name: true }
            });
            const subcategorias = [];
            for (const categoria of categorias) {
                // Receitas Subcategorias
                if (categoria.name === "Receitas Adicionais em Operações Financeiras") {
                    subcategorias.push({ name: "Juros Recebidos", categoria_id: categoria.id });
                }
                // Despesas Subcategorias
                if (categoria.name === "Custos de Produtos") {
                    subcategorias.push({ name: "Compra de Insumos", categoria_id: categoria.id });
                    subcategorias.push({ name: "Custos de Produção", categoria_id: categoria.id });
                    subcategorias.push({ name: "Fretes de Compras", categoria_id: categoria.id });
                }
                if (categoria.name === "Despesas Administrativas") {
                    subcategorias.push({ name: "Aluguel", categoria_id: categoria.id });
                    subcategorias.push({ name: "Condomínio", categoria_id: categoria.id });
                    subcategorias.push({ name: "Energia Elétrica", categoria_id: categoria.id });
                    subcategorias.push({ name: "Contabilidade", categoria_id: categoria.id });
                    subcategorias.push({ name: "Internet", categoria_id: categoria.id });
                    subcategorias.push({ name: "Software", categoria_id: categoria.id });
                    subcategorias.push({ name: "Taxas Diversas", categoria_id: categoria.id });
                }
                if (categoria.name === "Despesas Comerciais") {
                    subcategorias.push({ name: "Frete de Vendas", categoria_id: categoria.id });
                }
                if (categoria.name === "Despesas Marketing") {
                    subcategorias.push({ name: "Anúncios Patrocinados", categoria_id: categoria.id });
                    subcategorias.push({ name: "Gestão de Tráfego", categoria_id: categoria.id });
                    subcategorias.push({ name: "Manutenção Site", categoria_id: categoria.id });
                }
                if (categoria.name === "Despesas com Pessoal") {
                    subcategorias.push({ name: "FGTS", categoria_id: categoria.id });
                    subcategorias.push({ name: "INSS", categoria_id: categoria.id });
                    subcategorias.push({ name: "Rescisões", categoria_id: categoria.id });
                    subcategorias.push({ name: "Salários", categoria_id: categoria.id });
                    subcategorias.push({ name: "Sindicatos", categoria_id: categoria.id });
                }
                if (categoria.name === "Despesas Adicionais em Operações Financeiras") {
                    subcategorias.push({ name: "Descontos Concedidos", categoria_id: categoria.id });
                    subcategorias.push({ name: "Juros Pagos", categoria_id: categoria.id });
                    subcategorias.push({ name: "Taxas Pagas", categoria_id: categoria.id });
                }
                if (categoria.name === "Impostos") {
                    subcategorias.push({ name: "Cofins", categoria_id: categoria.id });
                    subcategorias.push({ name: "CSLL", categoria_id: categoria.id });
                    subcategorias.push({ name: "ICMS", categoria_id: categoria.id });
                    subcategorias.push({ name: "IOF", categoria_id: categoria.id });
                    subcategorias.push({ name: "IPI", categoria_id: categoria.id });
                    subcategorias.push({ name: "IPTU", categoria_id: categoria.id });
                    subcategorias.push({ name: "IPVA", categoria_id: categoria.id });
                    subcategorias.push({ name: "IRPF", categoria_id: categoria.id });
                    subcategorias.push({ name: "IRPJ", categoria_id: categoria.id });
                    subcategorias.push({ name: "ISS", categoria_id: categoria.id });
                    subcategorias.push({ name: "ITBI", categoria_id: categoria.id });
                    subcategorias.push({ name: "PIS", categoria_id: categoria.id });
                    subcategorias.push({ name: "Simples Nacional", categoria_id: categoria.id });
                }
                if (categoria.name === "Investimentos") {
                    subcategorias.push({ name: "Móveis e Utencílios", categoria_id: categoria.id });
                }
            }
            yield prisma_1.default.subCategoria.createMany({
                data: subcategorias
            });
        });
    }
}
exports.CreateCategoriasNovoUsuarioService = CreateCategoriasNovoUsuarioService;
