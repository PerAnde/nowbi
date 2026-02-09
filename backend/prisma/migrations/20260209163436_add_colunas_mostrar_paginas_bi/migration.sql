-- AlterTable
ALTER TABLE `empresas` ADD COLUMN `mostrar_detalhes` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `mostrar_dfc` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `mostrar_dre` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `mostrar_relatorio` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `mostrar_resumo` BOOLEAN NOT NULL DEFAULT true;
