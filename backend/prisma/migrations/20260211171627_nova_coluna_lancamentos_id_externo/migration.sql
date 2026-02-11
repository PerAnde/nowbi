/*
  Warnings:

  - A unique constraint covering the columns `[id_externo_lancamento]` on the table `lancamentos_bi` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `lancamentos_bi` ADD COLUMN `id_externo_lancamento` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `lancamentos_bi_id_externo_lancamento_key` ON `lancamentos_bi`(`id_externo_lancamento`);
