/*
  Warnings:

  - Made the column `dataFimPeriodoTeste` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `plano_id` INTEGER NULL,
    MODIFY `dataFimPeriodoTeste` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `planos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `limiteEmpresas` INTEGER NOT NULL,

    UNIQUE INDEX `planos_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_plano_id_fkey` FOREIGN KEY (`plano_id`) REFERENCES `planos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
