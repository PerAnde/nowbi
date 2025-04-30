-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `dataFimPeriodoTeste` DATETIME(3) NULL,
    ADD COLUMN `isPeriodoTesteAtivo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isPlanoAtivo` BOOLEAN NOT NULL DEFAULT true;
