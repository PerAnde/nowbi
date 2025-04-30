/*
  Warnings:

  - Added the required column `dataFimPeriodoTeste` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `dataFimPeriodoTeste` DATETIME(3) NOT NULL,
    ADD COLUMN `isPeriodoTesteAtivo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isPlanoAtivo` BOOLEAN NOT NULL DEFAULT false;
